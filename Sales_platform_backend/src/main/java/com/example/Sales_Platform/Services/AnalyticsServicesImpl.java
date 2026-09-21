package com.example.Sales_Platform.Services;

import com.example.Sales_Platform.DTO.AnalyticsResponseDTO;
import com.example.Sales_Platform.Intities.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional(Transactional.TxType.SUPPORTS)
public class AnalyticsServicesImpl implements AnalyticsServices {

    private static final String VALID_ORDER_STATUSES = "'CONFIRMED','PROCESSING','SHIPPED','DELIVERED'";
    private static final String VALID_PAYMENT_FILTER = "p.payment_status = 'SUCCESS' "
            + "AND o.status IN (" + VALID_ORDER_STATUSES + ") "
            + "AND DATE(COALESCE(p.paid_at, p.created_at, o.order_date, o.created_at)) BETWEEN :startDate AND :endDate";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public AnalyticsResponseDTO getAnalytics(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("A valid startDate and endDate are required.");
        }

        // 1. Period comparison setup
        long daysCount = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        LocalDate previousEnd = startDate.minusDays(1);
        LocalDate previousStart = previousEnd.minusDays(daysCount - 1);

        // 2. Revenue & Orders
        Object[] totals = one("SELECT COUNT(DISTINCT o.id), COALESCE(SUM(p.amount), 0) "
                + "FROM payments p JOIN orders o ON o.id = p.order_id WHERE " + VALID_PAYMENT_FILTER,
                startDate, endDate);
        long orders = totals.length > 0 ? number(totals[0]) : 0;
        BigDecimal revenue = totals.length > 1 ? decimal(totals[1]) : BigDecimal.ZERO;

        // 3. Profit Calculation (totalPrice - (quantity * costPrice))
        Object[] profitCheck = one("SELECT COUNT(*) FROM products WHERE cost_price IS NOT NULL AND cost_price > 0", null, null);
        boolean hasCostPrices = profitCheck.length > 0 && number(profitCheck[0]) > 0;

        BigDecimal profit = BigDecimal.ZERO;
        if (hasCostPrices) {
            Object[] profitRow = one("SELECT COALESCE(SUM(oi.total_price - (oi.quantity * COALESCE(pr.cost_price, 0))), 0) "
                    + "FROM order_items oi JOIN orders o ON o.id = oi.order_id "
                    + "JOIN payments p ON p.order_id = o.id JOIN products pr ON pr.id = oi.product_id WHERE "
                    + VALID_PAYMENT_FILTER, startDate, endDate);
            profit = profitRow.length > 0 ? decimal(profitRow[0]) : BigDecimal.ZERO;
        }

        // 4. Previous period revenue for period-over-period comparison
        Object[] prevRevRow = one("SELECT COALESCE(SUM(p.amount), 0) FROM payments p "
                + "JOIN orders o ON o.id = p.order_id WHERE " + VALID_PAYMENT_FILTER,
                previousStart, previousEnd);
        BigDecimal previousRevenue = prevRevRow.length > 0 ? decimal(prevRevRow[0]) : BigDecimal.ZERO;

        // 5. Daily Trends (Revenue and Profit)
        Map<String, BigDecimal> revenueByDate = new TreeMap<>();
        for (Object[] row : many("SELECT DATE(COALESCE(p.paid_at, p.created_at, o.order_date, o.created_at)), COALESCE(SUM(p.amount), 0) "
                + "FROM payments p JOIN orders o ON o.id = p.order_id WHERE " + VALID_PAYMENT_FILTER
                + " GROUP BY DATE(COALESCE(p.paid_at, p.created_at, o.order_date, o.created_at))", startDate, endDate)) {
            if (row.length > 0 && row[0] != null) {
                revenueByDate.put(String.valueOf(row[0]), row.length > 1 ? decimal(row[1]) : BigDecimal.ZERO);
            }
        }

        Map<String, BigDecimal> profitByDate = new TreeMap<>();
        if (hasCostPrices) {
            for (Object[] row : many("SELECT DATE(COALESCE(p.paid_at, p.created_at, o.order_date, o.created_at)), "
                    + "COALESCE(SUM(oi.total_price - (oi.quantity * COALESCE(pr.cost_price, 0))), 0) "
                    + "FROM order_items oi JOIN orders o ON o.id = oi.order_id JOIN payments p ON p.order_id = o.id "
                    + "JOIN products pr ON pr.id = oi.product_id WHERE " + VALID_PAYMENT_FILTER
                    + " GROUP BY DATE(COALESCE(p.paid_at, p.created_at, o.order_date, o.created_at))", startDate, endDate)) {
                if (row.length > 0 && row[0] != null) {
                    profitByDate.put(String.valueOf(row[0]), row.length > 1 ? decimal(row[1]) : BigDecimal.ZERO);
                }
            }
        }

        Set<String> trendDates = new TreeSet<>();
        trendDates.addAll(revenueByDate.keySet());
        trendDates.addAll(profitByDate.keySet());

        List<AnalyticsResponseDTO.TrendPoint> trend = trendDates.stream()
                .map(date -> new AnalyticsResponseDTO.TrendPoint(
                        date,
                        revenueByDate.getOrDefault(date, BigDecimal.ZERO),
                        profitByDate.getOrDefault(date, BigDecimal.ZERO)
                )).toList();

        // 6. Top Products (By units sold and revenue)
        List<AnalyticsResponseDTO.TopProduct> products = many("SELECT pr.name, COALESCE(SUM(oi.quantity), 0), COALESCE(SUM(oi.total_price), 0) "
                + "FROM order_items oi JOIN products pr ON pr.id = oi.product_id JOIN orders o ON o.id = oi.order_id "
                + "JOIN payments p ON p.order_id = o.id WHERE " + VALID_PAYMENT_FILTER
                + " GROUP BY pr.id, pr.name ORDER BY SUM(oi.quantity) DESC LIMIT 10", startDate, endDate)
                .stream()
                .filter(r -> r.length > 0 && r[0] != null)
                .map(r -> new AnalyticsResponseDTO.TopProduct(
                        String.valueOf(r[0]),
                        r.length > 1 ? number(r[1]) : 0,
                        r.length > 2 ? decimal(r[2]) : BigDecimal.ZERO
                )).toList();

        // 7. Category Revenue Contribution
        List<AnalyticsResponseDTO.CategoryRevenue> categories = many("SELECT c.name, COALESCE(SUM(oi.total_price), 0) "
                + "FROM order_items oi JOIN products pr ON pr.id = oi.product_id JOIN categories c ON c.id = pr.category_id "
                + "JOIN orders o ON o.id = oi.order_id JOIN payments p ON p.order_id = o.id WHERE " + VALID_PAYMENT_FILTER
                + " GROUP BY c.id, c.name ORDER BY SUM(oi.total_price) DESC", startDate, endDate)
                .stream()
                .filter(r -> r.length > 0 && r[0] != null)
                .map(r -> new AnalyticsResponseDTO.CategoryRevenue(
                        String.valueOf(r[0]),
                        r.length > 1 ? decimal(r[1]) : BigDecimal.ZERO
                )).toList();

        // 8. Order Status Distribution (All orders created within the period)
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (OrderStatus os : OrderStatus.values()) {
            statusMap.put(os.name(), 0L);
        }
        for (Object[] r : many("SELECT o.status, COUNT(*) FROM orders o "
                + "WHERE DATE(COALESCE(o.order_date, o.created_at)) BETWEEN :startDate AND :endDate GROUP BY o.status", startDate, endDate)) {
            if (r.length > 0 && r[0] != null) {
                statusMap.put(String.valueOf(r[0]), r.length > 1 ? number(r[1]) : 0);
            }
        }
        List<AnalyticsResponseDTO.StatusCount> statuses = statusMap.entrySet().stream()
                .map(entry -> new AnalyticsResponseDTO.StatusCount(entry.getKey(), entry.getValue()))
                .toList();

        // 9. Top Customers (By spending and order count)
        List<AnalyticsResponseDTO.TopCustomer> customers = many("SELECT c.name, COUNT(DISTINCT o.id), COALESCE(SUM(p.amount), 0) "
                + "FROM customers c JOIN orders o ON o.customer_id = c.id JOIN payments p ON p.order_id = o.id WHERE " + VALID_PAYMENT_FILTER
                + " GROUP BY c.id, c.name ORDER BY SUM(p.amount) DESC LIMIT 10", startDate, endDate)
                .stream()
                .filter(r -> r.length > 0 && r[0] != null)
                .map(r -> {
                    long count = r.length > 1 ? number(r[1]) : 0;
                    BigDecimal spent = r.length > 2 ? decimal(r[2]) : BigDecimal.ZERO;
                    BigDecimal customerAov = count == 0 ? BigDecimal.ZERO : spent.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
                    return new AnalyticsResponseDTO.TopCustomer(String.valueOf(r[0]), count, spent, customerAov);
                }).toList();

        // 10. Inventory Health & Movements
        Object[] inventory = one("SELECT COUNT(*), "
                + "COALESCE(SUM(CASE WHEN quantity > minimum_stock THEN 1 ELSE 0 END), 0), "
                + "COALESCE(SUM(CASE WHEN quantity > 0 AND quantity <= minimum_stock THEN 1 ELSE 0 END), 0), "
                + "COALESCE(SUM(CASE WHEN quantity <= 0 THEN 1 ELSE 0 END), 0) FROM inventory", null, null);

        long inStock = inventory.length > 1 ? number(inventory[1]) : 0;
        long lowStock = inventory.length > 2 ? number(inventory[2]) : 0;
        long outOfStock = inventory.length > 3 ? number(inventory[3]) : 0;
        long totalProducts = inventory.length > 0 ? number(inventory[0]) : 0;

        List<AnalyticsResponseDTO.InventoryMovement> movements = many("SELECT transaction_type, COALESCE(SUM(ABS(quantity)), 0) "
                + "FROM inventory_transactions WHERE DATE(created_at) BETWEEN :startDate AND :endDate GROUP BY transaction_type", startDate, endDate)
                .stream()
                .filter(r -> r.length > 0 && r[0] != null)
                .map(r -> new AnalyticsResponseDTO.InventoryMovement(String.valueOf(r[0]), r.length > 1 ? number(r[1]) : 0))
                .toList();

        // 11. Customer Count & Summary Assemble
        Object[] custRow = one("SELECT COUNT(*) FROM customers", null, null);
        long allCustomers = custRow.length > 0 ? number(custRow[0]) : 0;
        BigDecimal aov = orders == 0 ? BigDecimal.ZERO : revenue.divide(BigDecimal.valueOf(orders), 2, RoundingMode.HALF_UP);

        return new AnalyticsResponseDTO(
                new AnalyticsResponseDTO.Summary(orders, revenue, allCustomers, profit, aov, lowStock, previousRevenue),
                trend,
                products,
                categories,
                statuses,
                customers,
                new AnalyticsResponseDTO.InventorySummary(totalProducts, inStock, lowStock, outOfStock),
                movements,
                hasCostPrices
        );
    }

    private Object[] one(String sql, LocalDate start, LocalDate end) {
        var query = entityManager.createNativeQuery(sql);
        if (sql.contains(":startDate") && start != null) {
            query.setParameter("startDate", start);
        }
        if (sql.contains(":endDate") && end != null) {
            query.setParameter("endDate", end);
        }
        Object result = query.getSingleResult();
        if (result instanceof Object[] arr) {
            return arr;
        }
        return new Object[]{ result };
    }

    @SuppressWarnings("unchecked")
    private List<Object[]> many(String sql, LocalDate start, LocalDate end) {
        var query = entityManager.createNativeQuery(sql);
        if (sql.contains(":startDate") && start != null) {
            query.setParameter("startDate", start);
        }
        if (sql.contains(":endDate") && end != null) {
            query.setParameter("endDate", end);
        }
        List<?> raw = query.getResultList();
        List<Object[]> list = new ArrayList<>();
        for (Object item : raw) {
            if (item instanceof Object[] arr) {
                list.add(arr);
            } else {
                list.add(new Object[]{ item });
            }
        }
        return list;
    }

    private long number(Object value) {
        return value == null ? 0 : ((Number) value).longValue();
    }

    private BigDecimal decimal(Object value) {
        return value == null ? BigDecimal.ZERO : new BigDecimal(value.toString());
    }
}
