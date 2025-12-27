package com.kwick.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    String storeFile(MultipartFile file, String subpath) throws Exception;
}
