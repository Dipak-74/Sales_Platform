
package com.example.Sales_Platform.Services;

import java.io.IOException;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import com.example.Sales_Platform.Security.SupabaseConfig;

@Service
public class SupabaseStorageService {

    private final SupabaseConfig supabaseConfig;
    private final RestClient restClient;

    public SupabaseStorageService(
            SupabaseConfig supabaseConfig) {

        this.supabaseConfig = supabaseConfig;
        this.restClient = RestClient.create();
    }

    public String uploadImage(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Product image is empty"
            );
        }

        if (file.getContentType() == null ||
                !file.getContentType().startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Product image must be smaller than 5 MB"
            );
        }

        String originalName =
                file.getOriginalFilename();

        String safeName =
                originalName == null
                        ? "image"
                        : originalName.replaceAll(
                                "[^a-zA-Z0-9._-]",
                                "-"
                        );

        String fileName =
                UUID.randomUUID() + "-" + safeName;

        String filePath =
                "products/" + fileName;

        String projectUrl =
                supabaseConfig.getUrl()
                        .replaceFirst(
                                "/rest/v1/?$",
                                ""
                        )
                        .replaceFirst(
                                "/$",
                                ""
                        );

        String uploadUrl =
                projectUrl
                + "/storage/v1/object/"
                + supabaseConfig.getBucket()
                + "/"
                + filePath;

        restClient.post()
                .uri(uploadUrl)
                .header(
                        "Authorization",
                        "Bearer "
                                + supabaseConfig.getKey()
                )
                .header(
                        "apikey",
                        supabaseConfig.getKey()
                )
                .contentType(
                        MediaType.parseMediaType(
                                file.getContentType()
                        )
                )
                .body(file.getBytes())
                .retrieve()
                .toBodilessEntity();

        return projectUrl
                + "/storage/v1/object/public/"
                + supabaseConfig.getBucket()
                + "/"
                + filePath;
    }
}
