package com.example.Sales_Platform.Services;

import java.util.List;

import com.example.Sales_Platform.DTO.ProductRequestDTO;
import com.example.Sales_Platform.DTO.ProductResponseDTO;
import com.example.Sales_Platform.Intities.ProductStatus;

public interface ProductServices {

    ProductResponseDTO createProduct(ProductRequestDTO request);

    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(Long id);

    ProductResponseDTO getProductBySku(String sku);

    List<ProductResponseDTO> getProductsByCategory(Long categoryId);

    List<ProductResponseDTO> getProductsByStatus(ProductStatus status);

    List<ProductResponseDTO> searchProducts(String name);

    List<ProductResponseDTO> getProductsByCategoryAndStatus(
            Long categoryId,
            ProductStatus status);

    ProductResponseDTO updateProduct(
            Long id,
            ProductRequestDTO request);

    ProductResponseDTO updateProductStatus(
            Long id,
            ProductStatus status);
}