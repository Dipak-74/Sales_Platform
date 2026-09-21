package com.example.Sales_Platform.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCatalogController {

    private final CategoryServices categoryServices;
    private final ProductServices productServices;
    private final SupabaseStorageService storageService;

    public AdminCatalogController(
            CategoryServices categoryServices,
            ProductServices productServices,
            SupabaseStorageService storageService) {
        this.categoryServices = categoryServices;
        this.productServices = productServices;
        this.storageService = storageService;
    }

    @PostMapping("/categories")
    public CategoryResponseDTO createCategory(@RequestBody CategoryRequestDTO request) {
        return categoryServices.createCategory(request);
    }

    @GetMapping("/categories")
    public List<CategoryResponseDTO> getCategories() {
        return categoryServices.getAllCategories();
    }

    @GetMapping("/categories/{id}")
    public CategoryResponseDTO getCategory(@PathVariable Long id) {
        return categoryServices.getCategoryById(id);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponseDTO updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequestDTO request) {
        return categoryServices.updateCategory(id, request);
    }

    @PutMapping("/categories/{id}/status")
    public CategoryResponseDTO updateCategoryStatus(
            @PathVariable Long id,
            @RequestParam CategoryStatus status) {
        return categoryServices.updateCategoryStatus(id, status);
    }

    @GetMapping("/products")
    public List<ProductResponseDTO> getProducts() {
        return productServices.getAllProducts();
    }

    @GetMapping("/products/{id}")
    public ProductResponseDTO getProduct(@PathVariable Long id) {
        return productServices.getProductById(id);
    }

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponseDTO createProduct(
            @RequestPart("product") ProductRequestDTO request,
            @RequestPart(value = "image", required = false) MultipartFile image)
            throws IOException {
        if (image != null && !image.isEmpty()) {
            request.setImageUrl(storageService.uploadImage(image));
        }
        return productServices.createProduct(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponseDTO updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO request) {
        return productServices.updateProduct(id, request);
    }

    @PutMapping("/products/{id}/status")
    public ProductResponseDTO updateProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {
        return productServices.updateProductStatus(id, status);
    }

    @DeleteMapping("/products/{id}")
    public ProductResponseDTO deactivateProduct(@PathVariable Long id) {
        return productServices.updateProductStatus(id, ProductStatus.INACTIVE);
    }
}