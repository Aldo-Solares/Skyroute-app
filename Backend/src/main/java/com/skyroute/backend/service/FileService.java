package com.skyroute.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.exceptions.ImageFileException;

import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String baseDir;

    public void validateImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ImageFileException("Image is required");
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null || !originalName.contains(".")) {
            throw new ImageFileException("Invalid file name");
        }

        String extension = originalName
                .substring(originalName.lastIndexOf(".") + 1)
                .toLowerCase();

        List<String> allowed = List.of("jpg", "jpeg", "png");

        if (!allowed.contains(extension)) {
            throw new ImageFileException("Only JPG, JPEG, PNG allowed");
        }

        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new ImageFileException("Only images allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new ImageFileException("File too large (max 10MB)");
        }
    }

    public String uploadSingleImage(MultipartFile file, String folder) {

        validateImage(file);

        try {
            String originalName = file.getOriginalFilename();
            String extension = originalName
                    .substring(originalName.lastIndexOf(".") + 1)
                    .toLowerCase();

            String fileName = UUID.randomUUID() + "." + extension;

            String uploadDir = baseDir + File.separator + folder;

            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File destination = new File(dir, fileName);
            file.transferTo(destination);

            return fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new ImageFileException("Error saving file: " + e.getMessage());
        }
    }
}