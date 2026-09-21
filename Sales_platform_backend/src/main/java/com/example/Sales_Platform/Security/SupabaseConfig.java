package com.example.Sales_Platform.Security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SupabaseConfig {

    @Value("${supabase.url}")
    private String url;

    @Value("${supabase.key}")
    private String key;

    @Value("${supabase.bucket}")
    private String bucket;

    public String getUrl() {
        return url;
    }

    public String getKey() {
        return key;
    }

    public String getBucket() {
        return bucket;
    }
}