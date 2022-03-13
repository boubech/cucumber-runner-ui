package com.boubech.cucumber.ui.api;


import com.boubech.cucumber.ui.converters.FileToFileResponse;
import com.boubech.cucumber.ui.model.FileResponse;
import com.boubech.cucumber.ui.model.InlineObject1;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.util.MultiValueMapAdapter;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class FileApiDelegateImpl implements FilesApiDelegate {

    private final FileToFileResponse fileToFileResponse;
    private final WorkspaceService workspaceService;

    public FileApiDelegateImpl(FileToFileResponse fileToFileResponse, WorkspaceService workspaceService) {
        this.fileToFileResponse = fileToFileResponse;
        this.workspaceService = workspaceService;
    }

    @Override
    public ResponseEntity<String> uploadFile(MultipartFile file,
                                             String filename) {
        try {
            workspaceService.add(filename, file);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<FileResponse>> getFiles() {
        List<FileResponse> fileReponse = Collections.singletonList(fileToFileResponse.apply(workspaceService.getRoot()));
        return new ResponseEntity<>(fileReponse, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteFile(String pathB64) {
        File file = workspaceService.getFileFromPath(decodePath(pathB64));
        if (file.exists()) {
            workspaceService.delete(decodePath(pathB64));
            return ResponseEntity.ok(pathB64);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<String> moveFile(String pathB64, InlineObject1 inlineObject1) {
        try {
            File file = workspaceService.getFileFromPath(decodePath(pathB64));
            if (file.exists()) {
                workspaceService.move(decodePath(pathB64), inlineObject1.getDest());
                return ResponseEntity.ok(pathB64);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @Override
    public ResponseEntity<org.springframework.core.io.Resource> getFileContent(String pathB64) {
        try {
            File file = workspaceService.getFileFromPath(decodePath(pathB64));
            if (file.exists()) {
                Resource resource = new org.springframework.core.io.FileSystemResource(file);
                MultiValueMap<String, String> headers = new MultiValueMapAdapter<>(
                        Map.of("Content-Disposition", List.of("attachment", "filename=\"" + file.getName() + "\"")));
                return new ResponseEntity<>(resource, headers, HttpStatus.OK);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception exception) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String decodePath(String pathB64) {
        return new String(Base64.getDecoder().decode(pathB64));
    }
}
