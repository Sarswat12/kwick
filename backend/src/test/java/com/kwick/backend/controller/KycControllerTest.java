package com.kwick.backend.controller;

import com.kwick.backend.repository.KycRepository;
import com.kwick.backend.service.StorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class KycControllerTest {


    private StorageService storageService;
    private KycRepository kycRepository;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        storageService = mock(StorageService.class);
        kycRepository = mock(KycRepository.class);
        KycController controller = new KycController(storageService, kycRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    @SuppressWarnings("null")
    void submitKyc_uploadsFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", MediaType.IMAGE_JPEG_VALUE,
            "data".getBytes());
        when(storageService.storeFile(any(), anyString())).thenReturn("/tmp/test.jpg");

        mockMvc.perform(multipart("/api/kyc/upload/aadhaar-front")
            .file(file)
            .requestAttr("userId", 1L))
            .andExpect(status().isOk());

        verify(storageService, times(1)).storeFile(any(), anyString());
        verify(kycRepository, times(1)).save(org.mockito.ArgumentMatchers.<com.kwick.backend.model.KycVerification>argThat(kyc -> kyc != null));
    }
}
