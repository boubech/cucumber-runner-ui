package com.boubech.cucumber.ui.services;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class WorkspaceService {

    private final File workspaceFolder;
    private final List<TestExecutionContext> testExecutionContexts = new ArrayList<>();

    public WorkspaceService(File workspaceFolder) {
        this.workspaceFolder = workspaceFolder;
        if (!workspaceFolder.exists() && !workspaceFolder.mkdirs()) {
            throw new IllegalStateException("Unable to create directory " + workspaceFolder.getAbsolutePath());
        }
    }

    public WorkspaceService() {
        this.workspaceFolder = new File("./.workspace");
        if (!workspaceFolder.exists() && !workspaceFolder.mkdirs()) {
            throw new IllegalStateException("Unable to create directory " + workspaceFolder.getAbsolutePath());
        }
    }

    public void add(String filename, MultipartFile multipartFile) throws IOException {
        File file = new File(workspaceFolder.getAbsolutePath() + File.separator + ".." + File.separator + filename);
        if (!fileIsInWorkspace(file)) {
            throw new IllegalStateException("Unable to create file " + file.getAbsolutePath() + ", file is located outside of workspace");
        }
        try (OutputStream os = new FileOutputStream(file)) {
            os.write(multipartFile.getBytes());
        }
    }

    public void makeDirectory(String directory) {
        File file = new File(workspaceFolder.getAbsolutePath() + File.separator + ".." + File.separator + directory);
        if (!fileIsInWorkspace(file)) {
            throw new IllegalStateException("Unable to create directory " + file.getAbsolutePath() + ", directory is located outside of workspace");
        } else if (!file.mkdirs()) {
            throw new IllegalStateException("Unable to create directory " + file.getAbsolutePath());
        }
    }

    private boolean fileIsInWorkspace(File file) {
        return file.getAbsoluteFile().toPath().normalize().startsWith(workspaceFolder.getAbsoluteFile().toPath().normalize());
    }

    public void delete(String filename) {
        File file = new File(filename);
        if (!fileIsInWorkspace(file)) {
            throw new IllegalStateException("Unable to delete file " + file.getAbsolutePath() + ", it's located outside of workspace");
        } else if (file.isFile() && !file.delete()) {
            throw new IllegalStateException("Unable to delete file " + file.getAbsolutePath());
        } else if (file.isDirectory()) {
            try {
                FileUtils.deleteDirectory(file);
            } catch (IOException e) {
                throw new IllegalStateException("Unable to delete directory " + file.getAbsolutePath(), e);
            }
        }
    }

    public String[] list() {
        return workspaceFolder.list();
    }


    public File getRoot() {
        return workspaceFolder;
    }


    public TestExecutionContext createNewTestExecutionContext(Map<String, String> properties, Map<String, String> environments) {

        DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd-hh-mm-ss");
        String id = ZonedDateTime.now().format(dateFormat);
        File directory = getTextExecutionDirectoryFromIdentifier(id);

        if (!directory.mkdirs()) {
            throw new IllegalStateException("Unable to create directory : " + directory.getAbsolutePath());
        }

        TestExecutionContext testExecutionContext = TestExecutionContext.of(id, directory, properties, environments);
        testExecutionContexts.add(testExecutionContext);
        return testExecutionContext;
    }

    private File getTextExecutionDirectoryFromIdentifier(String id) {
        return new File(workspaceFolder.getAbsolutePath() + File.separator + "executions" + File.separator + id);
    }

    public Optional<TestExecutionContext> findTestExecutionContextById(String reportId) {
        return this.testExecutionContexts.stream().filter(testExecutionContext -> testExecutionContext.getIdentifier().equals(reportId)).findFirst();
    }

    public List<File> listFiles() {
        return List.of(Objects.requireNonNull(this.getRoot().listFiles()));
    }

}
