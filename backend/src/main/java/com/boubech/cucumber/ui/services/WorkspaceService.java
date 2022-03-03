package com.boubech.cucumber.ui.services;

import com.boubech.cucumber.ui.model.FileResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class WorkspaceService {

    private static final File workspaceFolder = new File("./.workspace");
    private final List<TestExecutionContext> testExecutionContexts = new ArrayList<>();

    public WorkspaceService() {
        if (!workspaceFolder.exists() && !workspaceFolder.mkdirs()) {
            throw new IllegalStateException("Unable to create directory " + workspaceFolder.getAbsolutePath());
        }
    }

    public void add(String filename, MultipartFile multipartFile) throws IOException {
        File file = new File(workspaceFolder.getAbsolutePath() + File.separator + filename);
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(multipartFile.getBytes());
        }
    }

    public String[] list() {
        return workspaceFolder.list();
    }

    public List<File> getFiles() {
        return List.of(workspaceFolder.listFiles());
    }

    public List<File> listFiles() {
        return Arrays.stream(Objects.requireNonNull(workspaceFolder.listFiles())).collect(Collectors.toList());
    }


    public TestExecutionContext createNewTestExecutionContext() {
        int i = 0;
        Optional<TestExecutionContext> existingContext;
        File directory;
        do {
            existingContext = this.findTestExecutionContextById(i);
            directory = getTextExecutionDirectoryFromIdentifier(i);
            i = i + 1;
        } while (directory.exists() || existingContext.isPresent());

        if (!directory.mkdirs()) {
            throw new IllegalStateException("Unable to create directory : " + directory.getAbsolutePath());
        }

        TestExecutionContext testExecutionContext = TestExecutionContext.of(i, directory);
        testExecutionContexts.add(testExecutionContext);
        return testExecutionContext;
    }

    private File getTextExecutionDirectoryFromIdentifier(int i) {
        return new File(workspaceFolder.getAbsolutePath() + File.separator + "executions" + File.separator + i);
    }

    public Optional<TestExecutionContext> findTestExecutionContextById(Integer reportId) {
        return this.testExecutionContexts.stream().filter(testExecutionContext -> testExecutionContext.getIdentifier() == reportId).findFirst();
    }
}
