package com.boubech.cucumber.ui.services;

import lombok.Getter;
import lombok.Setter;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
public class TestExecutionContext {

    private final String identifier;
    private final File rootDirectory;
    private final File feature;
    private final File htmlReport;
    private final File prettyReport;
    private final File jsonReport;
    private final File logFile;
    private final Map<String, String> properties;
    private final Map<String, String> environments;
    private final List<String> log = new ArrayList<>();

    @Setter
    private State state;

    public TestExecutionContext(String identifier,
                                File rootDirectory,
                                File feature,
                                File htmlReport,
                                File prettyReport,
                                File jsonReport,
                                File logFile,
                                Map<String, String> properties,
                                Map<String, String> environments) {
        this.identifier = identifier;
        this.rootDirectory = rootDirectory;
        this.feature = feature;
        this.htmlReport = htmlReport;
        this.prettyReport = prettyReport;
        this.jsonReport = jsonReport;
        this.logFile = logFile;
        this.properties = properties;
        this.environments = environments;
        this.state = State.PENDING;
    }

    public static TestExecutionContext of(String id, File rootDirectory, Map<String, String> properties, Map<String, String> environments) {
        File feature = new File(rootDirectory.getAbsolutePath() + File.separator + "current.feature");
        File htmlReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.html");
        File jsonReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.json");
        File prettyReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.pretty");
        File logFile = new File(rootDirectory.getAbsolutePath() + File.separator + "execution.log");
        return new TestExecutionContext(id, rootDirectory, feature, htmlReport, prettyReport, jsonReport, logFile, properties, environments);
    }

    public List<String> getHtmlReportAsString() {
        try {
            return Files.readAllLines(this.getHtmlReport().toPath());
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read file " + this.getHtmlReport().getAbsolutePath());
        }
    }

    public enum State {
        PENDING,
        RUNNING,
        FAILED,
        SUCCESS,
        ERROR,
    }
}
