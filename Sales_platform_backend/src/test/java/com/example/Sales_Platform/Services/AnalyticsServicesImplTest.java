package com.example.Sales_Platform.Services;

import com.example.Sales_Platform.DTO.AnalyticsResponseDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AnalyticsServicesImplTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private Query query;

    @InjectMocks
    private AnalyticsServicesImpl analyticsServices;

    @BeforeEach
    void setUp() {
        when(entityManager.createNativeQuery(anyString())).thenReturn(query);
        when(query.setParameter(anyString(), any())).thenReturn(query);
    }

    @Test
    void getAnalytics_shouldThrowExceptionForInvalidDates() {
        assertThrows(IllegalArgumentException.class, () ->
                analyticsServices.getAnalytics(null, LocalDate.now()));

        assertThrows(IllegalArgumentException.class, () ->
                analyticsServices.getAnalytics(LocalDate.now(), null));

        assertThrows(IllegalArgumentException.class, () ->
                analyticsServices.getAnalytics(LocalDate.now(), LocalDate.now().minusDays(5)));
    }

    @Test
    void getAnalytics_shouldReturnValidDTOWhenQueriesExecute() {
        // Mock single-result queries in invocation order:
        when(query.getSingleResult()).thenReturn(
                new Object[]{ 5L, new BigDecimal("1500.00") }, // totals
                new Object[]{ 10L }, // profitCheck hasCostPrices
                new Object[]{ new BigDecimal("450.00") }, // profit
                new Object[]{ new BigDecimal("1200.00") }, // previousRevenue
                new Object[]{ 20L, 15L, 3L, 2L }, // inventory
                new Object[]{ 8L } // allCustomers
        );

        // Mock list queries in invocation order:
        when(query.getResultList()).thenReturn(
                Collections.singletonList(new Object[]{ "2026-09-18", new BigDecimal("700.00") }), // revenueByDate
                Collections.singletonList(new Object[]{ "2026-09-18", new BigDecimal("200.00") }), // profitByDate
                Collections.singletonList(new Object[]{ "Product A", 10L, new BigDecimal("800.00") }), // topProducts
                Collections.singletonList(new Object[]{ "Electronics", new BigDecimal("1200.00") }), // categories
                Collections.singletonList(new Object[]{ "CONFIRMED", 5L }), // statuses
                Collections.singletonList(new Object[]{ "Customer X", 3L, new BigDecimal("900.00") }), // topCustomers
                Collections.singletonList(new Object[]{ "IN", 50L }) // movements
        );

        LocalDate start = LocalDate.of(2026, 9, 1);
        LocalDate end = LocalDate.of(2026, 9, 20);

        AnalyticsResponseDTO response = analyticsServices.getAnalytics(start, end);

        assertNotNull(response);
        assertNotNull(response.summary());
        assertEquals(5L, response.summary().totalOrders());
        assertEquals(new BigDecimal("1500.00"), response.summary().totalRevenue());
        assertEquals(new BigDecimal("450.00"), response.summary().totalProfit());
        assertEquals(new BigDecimal("300.00"), response.summary().averageOrderValue());
        assertEquals(8L, response.summary().totalCustomers());
        assertEquals(3L, response.summary().lowStockProducts());
        assertEquals(new BigDecimal("1200.00"), response.summary().previousPeriodRevenue());

        assertTrue(response.profitAvailable());
        assertEquals(1, response.salesTrend().size());
        assertEquals(1, response.topProducts().size());
        assertEquals("Product A", response.topProducts().get(0).product());
        assertEquals(1, response.categoryRevenue().size());
        assertEquals("Electronics", response.categoryRevenue().get(0).category());
        assertFalse(response.orderStatuses().isEmpty());
        assertEquals(1, response.topCustomers().size());
        assertEquals("Customer X", response.topCustomers().get(0).customer());
        assertEquals(20L, response.inventory().totalProducts());
        assertEquals(15L, response.inventory().inStock());
        assertEquals(3L, response.inventory().lowStock());
        assertEquals(2L, response.inventory().outOfStock());
        assertEquals(1, response.inventoryMovements().size());
    }
}

