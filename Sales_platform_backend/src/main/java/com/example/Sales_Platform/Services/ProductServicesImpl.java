
package com.example.Sales_Platform.Services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Sales_Platform.DTO.ProductRequestDTO;
import com.example.Sales_Platform.DTO.ProductResponseDTO;
import com.example.Sales_Platform.Intities.Category;
import com.example.Sales_Platform.Intities.Inventory;
import com.example.Sales_Platform.Intities.Product;
import com.example.Sales_Platform.Intities.ProductStatus;
import com.example.Sales_Platform.Repo.CategoryRepo;
import com.example.Sales_Platform.Repo.InventoryRepo;
import com.example.Sales_Platform.Repo.ProductRepo;

@Service
public class ProductServicesImpl implements ProductServices {

    @Autowired
    ProductRepo productRepo;

    @Autowired
    CategoryRepo categoryRepo;

        @Autowired
        InventoryRepo inventoryRepo;


    // CREATE
    @Override
        @Transactional
    public ProductResponseDTO createProduct(
            ProductRequestDTO request) {

                validateProductRequest(request);

                if (productRepo.findBySku(request.getSku().trim()).isPresent()) {
                        throw new RuntimeException("Product SKU already exists");
                }

        // Find Category
        Category category = categoryRepo
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"));

        // Create Product
        Product product = new Product();

        product.setName(request.getName());
        product.setSku(request.getSku().trim());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());

        // Supabase image URL
        product.setImageUrl(request.getImageUrl());

        // Backend controlled
        product.setStatus(ProductStatus.ACTIVE);

        // Save
        Product savedProduct =
                productRepo.save(product);

        Inventory inventory = new Inventory();
        inventory.setProduct(savedProduct);
        inventory.setQuantity(0);
        inventory.setMinimumStock(10);
        inventoryRepo.save(inventory);

        return mapToResponseDTO(savedProduct);
    }


    // GET ALL
    @Override
    public List<ProductResponseDTO> getAllProducts() {

        return productRepo.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY ID
    @Override
    public ProductResponseDTO getProductById(Long id) {

        Product product = productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"));

        return mapToResponseDTO(product);
    }


    // GET BY SKU
    @Override
    public ProductResponseDTO getProductBySku(
            String sku) {

        Product product = productRepo.findBySku(sku)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"));

        return mapToResponseDTO(product);
    }


    // GET BY CATEGORY
    @Override
    public List<ProductResponseDTO> getProductsByCategory(
            Long categoryId) {

        return productRepo
                .findByCategory_Id(categoryId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // GET BY STATUS
    @Override
    public List<ProductResponseDTO> getProductsByStatus(
            ProductStatus status) {

        return productRepo
                .findByStatus(status)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // SEARCH BY NAME
    @Override
    public List<ProductResponseDTO> searchProducts(
            String name) {

        return productRepo
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // CATEGORY + STATUS
    @Override
    public List<ProductResponseDTO>
    getProductsByCategoryAndStatus(
            Long categoryId,
            ProductStatus status) {

        return productRepo
                .findByCategory_IdAndStatus(
                        categoryId,
                        status)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }


    // UPDATE
    @Override
    public ProductResponseDTO updateProduct(
            Long id,
            ProductRequestDTO request) {

        validateProductRequest(request);

        Product product = productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"));

        Category category = categoryRepo
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"));

        product.setName(request.getName());
                if (!product.getSku().equalsIgnoreCase(request.getSku().trim())
                                && productRepo.findBySku(request.getSku().trim()).isPresent()) {
                        throw new RuntimeException("Product SKU already exists");
                }

                product.setSku(request.getSku().trim());
        product.setDescription(request.getDescription());
        product.setCategory(category);
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());

        // Update Supabase image URL
        product.setImageUrl(request.getImageUrl());

        Product updatedProduct =
                productRepo.save(product);

        return mapToResponseDTO(updatedProduct);
    }

        private void validateProductRequest(ProductRequestDTO request) {
                if (request == null || request.getName() == null || request.getName().isBlank()) {
                        throw new RuntimeException("Product name is required");
                }
                if (request.getSku() == null || request.getSku().isBlank()) {
                        throw new RuntimeException("Product SKU is required");
                }
                if (request.getCategoryId() == null) {
                        throw new RuntimeException("Category is required");
                }
                if (request.getCostPrice() == null || request.getCostPrice().compareTo(BigDecimal.ZERO) < 0) {
                        throw new RuntimeException("Cost price cannot be negative");
                }
                if (request.getSellingPrice() == null || request.getSellingPrice().compareTo(BigDecimal.ZERO) <= 0) {
                        throw new RuntimeException("Selling price must be greater than zero");
                }
        }


    // UPDATE STATUS
    @Override
    public ProductResponseDTO updateProductStatus(
            Long id,
            ProductStatus status) {

        Product product = productRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"));

        product.setStatus(status);

        Product updatedProduct =
                productRepo.save(product);

        return mapToResponseDTO(updatedProduct);
    }


    // ENTITY → DTO
    private ProductResponseDTO mapToResponseDTO(
            Product product) {

        ProductResponseDTO dto =
                new ProductResponseDTO();

        dto.setProductId(product.getId());
        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setDescription(product.getDescription());

        if (product.getCategory() != null) {

            dto.setCategoryId(
                    product.getCategory().getId());

            dto.setCategoryName(
                    product.getCategory().getName());
        }

        dto.setCostPrice(
                product.getCostPrice());

        dto.setSellingPrice(
                product.getSellingPrice());

        // Supabase image URL
        dto.setImageUrl(
                product.getImageUrl());

        dto.setStatus(
                product.getStatus());

        return dto;
    }
}