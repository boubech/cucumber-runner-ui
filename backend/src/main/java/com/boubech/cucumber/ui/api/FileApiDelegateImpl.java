package com.boubech.cucumber.ui.api;


import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
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
    public ResponseEntity<List<String>> getFiles() {
        List<String> body = Arrays.stream(workspaceService.list()).collect(Collectors.toList());
        return new ResponseEntity<>(body, HttpStatus.OK);

    }

}
