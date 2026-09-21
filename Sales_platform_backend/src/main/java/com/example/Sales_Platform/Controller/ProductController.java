package com.example.Sales_Platform.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Sales_Platform.DTO.CategoryRequestDTO;
import com.example.Sales_Platform.DTO.CategoryResponseDTO;
import com.example.Sales_Platform.DTO.ProductRequestDTO;
import com.example.Sales_Platform.DTO.ProductResponseDTO;
import com.example.Sales_Platform.Intities.CategoryStatus;
import com.example.Sales_Platform.Intities.ProductStatus;
import com.example.Sales_Platform.Services.CategoryServices;
import com.example.Sales_Platform.Services.ProductServices;
import com.example.Sales_Platform.Services.SupabaseStorageService;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductServices productServices;
    private final CategoryServices categoryServices;
    private final SupabaseStorageService supabaseStorageService;

    public ProductController(
            ProductServices productServices,
            CategoryServices categoryServices,
            SupabaseStorageService supabaseStorageService) {

        this.productServices = productServices;
        this.categoryServices = categoryServices;
        this.supabaseStorageService = supabaseStorageService;
    }

    // ==================== PRODUCTS ====================

    @GetMapping("/products")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<ProductResponseDTO> getAllProducts() {
        return productServices.getAllProducts();
    }

    @GetMapping("/products/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public ProductResponseDTO getProductById(
            @PathVariable Long id) {

        return productServices.getProductById(id);
    }

    @GetMapping("/products/sku")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public ProductResponseDTO getProductBySku(
            @RequestParam String sku) {

        return productServices.getProductBySku(sku);
    }

    @GetMapping("/products/category/{categoryId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<ProductResponseDTO> getProductsByCategory(
            @PathVariable Long categoryId) {

        return productServices.getProductsByCategory(categoryId);
    }

    @GetMapping("/products/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<ProductResponseDTO> getProductsByStatus(
            @RequestParam ProductStatus status) {

        return productServices.getProductsByStatus(status);
    }

    @GetMapping("/products/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<ProductResponseDTO> searchProducts(
            @RequestParam String name) {

        return productServices.searchProducts(name);
    }

    @GetMapping("/products/filter")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<ProductResponseDTO> getProductsByCategoryAndStatus(
            @RequestParam Long categoryId,
            @RequestParam ProductStatus status) {

        return productServices.getProductsByCategoryAndStatus(
                categoryId,
                status
        );
    }

    // CREATE PRODUCT + IMAGE
    @PostMapping(
            value = "/products",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
        @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ProductResponseDTO createProduct(

            @RequestPart("product")
            ProductRequestDTO request,

            @RequestPart(value = "image", required = false)
            MultipartFile image)

            throws IOException {

        String imageUrl = image == null || image.isEmpty()
            ? request.getImageUrl()
            : supabaseStorageService.uploadImage(image);

        request.setImageUrl(imageUrl);

        return productServices.createProduct(request);
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ProductResponseDTO updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO request) {

        return productServices.updateProduct(id, request);
    }

    @PutMapping("/products/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ProductResponseDTO updateProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {

        return productServices.updateProductStatus(
                id,
                status
        );
    }

    // ==================== CATEGORIES ====================

    @GetMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryServices.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE', 'CUSTOMER')")
    public CategoryResponseDTO getCategoryById(
            @PathVariable Long id) {

        return categoryServices.getCategoryById(id);
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public CategoryResponseDTO createCategory(
            @RequestBody CategoryRequestDTO request) {

        return categoryServices.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public CategoryResponseDTO updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO request) {

        return categoryServices.updateCategory(
                id,
                request
        );
    }

    @PutMapping("/categories/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'EMPLOYEE')")
    public CategoryResponseDTO updateCategoryStatus(
            @PathVariable Long id,
            @RequestParam CategoryStatus status) {

        return categoryServices.updateCategoryStatus(
                id,
                status
        );
    }
}