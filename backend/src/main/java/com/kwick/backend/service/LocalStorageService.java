package com.kwick.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@Service
@ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "false", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final Path baseDir = Path.of(System.getProperty("user.dir"), "backend-uploads");

    public LocalStorageService() throws Exception {
        Files.createDirectories(baseDir);
    }

    @Override
    public String storeFile(MultipartFile file, String subpath) throws Exception {
        Path destDir = baseDir.resolve(subpath == null ? "" : subpath);
        Files.createDirectories(destDir);
        Path dest = destDir.resolve(System.currentTimeMillis() + "-" + file.getOriginalFilename());
        try (var in = file.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }
        return dest.toAbsolutePath().toString();
    }
}
