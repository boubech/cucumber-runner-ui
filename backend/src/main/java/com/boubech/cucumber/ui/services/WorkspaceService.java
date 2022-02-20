package com.boubech.cucumber.ui.services;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class WorkspaceService {

    private static final File workspaceFolder = new File("./.workspace");


    public void add(String filename, MultipartFile multipartFile) throws IOException {
        File file = new File(workspaceFolder.getAbsolutePath() + File.separator + filename);
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(multipartFile.getBytes());
        }
    }

    public File getRootFolder() {
        return this.workspaceFolder;
    }

    public String[] list() {
        return workspaceFolder.list();
    }


    public List<File> listFiles() {
        return Arrays.stream(workspaceFolder.listFiles()).collect(Collectors.toList());
    }
}
