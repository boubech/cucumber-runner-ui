package com.boubech.cucumber.ui.api;


import com.boubech.cucumber.ui.model.FileResponse;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class FileApiDelegateImpl implements FilesApiDelegate {

    private final WorkspaceService workspaceService;

    public FileApiDelegateImpl(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @Override
    public ResponseEntity<String> uploadFile(MultipartFile file,
                                             String filename) {
        try {
            workspaceService.add(filename, file);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @Override
    public ResponseEntity<List<FileResponse>> getFiles() {
        List<FileResponse> body = workspaceService.listFiles().stream()
                .map(this::convertFileToFileResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(body, HttpStatus.OK);
    }


    private FileResponse convertFileToFileResponse(File file) {
        FileResponse fileResponse = new FileResponse();
        fileResponse.setName(file.getName());
        fileResponse.setPath(file.getPath());
        fileResponse.isDirectory(file.isDirectory());
        fileResponse.setFiles(file.isDirectory() ? Arrays.stream(Objects.requireNonNull(file.listFiles())).map(this::convertFileToFileResponse).collect(Collectors.toList()) : null);
        return fileResponse;
    }

}
