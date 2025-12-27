package com.kwick.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service
@ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "true")
public class S3StorageService implements StorageService {

    private final S3Client s3;
    private final String bucket;

    public S3StorageService(@Value("${aws.s3.bucket:}") String bucket) {
        this.bucket = bucket;
        this.s3 = S3Client.builder().build();
    }

    @Override
    public String storeFile(MultipartFile file, String subpath) throws Exception {
        String key = (subpath == null ? "" : subpath + "/") + Instant.now().toEpochMilli() + "-"
                + URLEncoder.encode(file.getOriginalFilename(), StandardCharsets.UTF_8);
        try (InputStream in = file.getInputStream()) {
            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3.putObject(req, RequestBody.fromInputStream(in, file.getSize()));
        }
        // Return a simple s3 url; production should use signed urls or public buckets
        return String.format("s3://%s/%s", bucket, key);
    }
}
