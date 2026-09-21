package com.example.Sales_Platform.DTO;

import java.math.BigDecimal;
import java.util.List;

/** Read-only, aggregated data used by the admin and manager analytics screens. */
public record AnalyticsResponseDTO(
        Summary summary,
        List<TrendPoint> salesTrend,
        List<TopProduct> topProducts,
        List<CategoryRevenue> categoryRevenue,
        List<StatusCount> orderStatuses,
        List<TopCustomer> topCustomers,
        InventorySummary inventory,
        List<InventoryMovement> inventoryMovements,
        boolean profitAvailable) {

    public record Summary(long totalOrders, BigDecimal totalRevenue, long totalCustomers,
                          BigDecimal totalProfit, BigDecimal averageOrderValue,
                          long lowStockProducts, BigDecimal previousPeriodRevenue) { }
    public record TrendPoint(String date, BigDecimal revenue, BigDecimal profit) { }
    public record TopProduct(String product, long quantitySold, BigDecimal revenue) { }
    public record CategoryRevenue(String category, BigDecimal revenue) { }
    public record StatusCount(String status, long count) { }
    public record TopCustomer(String customer, long orders, BigDecimal totalSpent,
                              BigDecimal averageOrderValue) { }
    public record InventorySummary(long totalProducts, long inStock, long lowStock, long outOfStock) { }
    public record InventoryMovement(String type, long quantity) { }
}
