package com.boubech.cucumber.ui.services;

import lombok.Getter;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@Getter
public class TestExecutionContext {

    private final int identifier;
    private final File rootDirectory;
    private final File feature;
    private final File htmlReport;
    private final File prettyReport;
    private final File jsonReport;

    public TestExecutionContext(int identifier, File rootDirectory, File feature, File htmlReport, File prettyReport, File jsonReport) {
        this.identifier = identifier;
        this.rootDirectory = rootDirectory;
        this.feature = feature;
        this.htmlReport = htmlReport;
        this.prettyReport = prettyReport;
        this.jsonReport = jsonReport;
    }

    public static TestExecutionContext of(int id, File rootDirectory) {
        File feature = new File(rootDirectory.getAbsolutePath() + File.separator + "current.feature");
        File htmlReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.html");
        File jsonReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.json");
        File prettyReport = new File(rootDirectory.getAbsolutePath() + File.separator + "report.pretty");
        return new TestExecutionContext(id, rootDirectory, feature, htmlReport, prettyReport, jsonReport);
    }

    public List<String> getHtmlReportAsString() {
        try {
            return Files.readAllLines(this.getHtmlReport().toPath());
        } catch (IOException e) {
            throw new IllegalStateException("Unable to read file " + this.getHtmlReport().getAbsolutePath());
        }
    }
}
