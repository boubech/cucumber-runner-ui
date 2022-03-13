package com.boubech.cucumber.ui.services;

import com.boubech.cucumber.ui.websocket.LoggerService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;


class TestRunnerOutsideServiceTest {

    private final WorkspaceService workspaceService = new WorkspaceService(new File(System.getProperty("java.io.tmpdir") + File.separator + "workspace"));
    private final WorkspaceClassLoader workspaceClassLoader = new WorkspaceClassLoader(workspaceService);
    private final CucumberService cucumberService = new CucumberService(workspaceClassLoader);
    private final LoggerService loggerService = mock(LoggerService.class);
    private final TestRunnerCommandLine testRunnerCommandLine = new TestRunnerCommandLine(loggerService, cucumberService, workspaceService);

    TestRunnerOutsideServiceTest() throws IOException {
        workspaceService.getRoot().deleteOnExit();
        assertTrue(workspaceService.getRoot().exists());
        copyGlueJar();
    }

    @Test
    void given_feature_string_when_run_then_report_are_created() throws IOException, InterruptedException {

        TestExecutionContext testExecutionContext = workspaceService.createNewTestExecutionContext(Map.of(), Map.of());
        Files.writeString(testExecutionContext.getFeature().toPath(), "Feature: Addition\n" +
                "  Scenario: Nominal\n" +
                "    Given an integer 1\n" +
                "    When add -1\n" +
                "    Then the result is 0");

        testExecutionContext.setState(TestExecutionContext.State.RUNNING);
        this.testRunnerCommandLine.run(testExecutionContext, t -> t.setState(TestExecutionContext.State.SUCCESS), t -> t.setState(TestExecutionContext.State.FAILED));
        do {
            Thread.sleep(100);
        } while(testExecutionContext.getState().equals(TestExecutionContext.State.RUNNING));

        assertThat(testExecutionContext.getState()).isEqualTo(TestExecutionContext.State.SUCCESS);
        assertThat(testExecutionContext.getHtmlReport()).exists();
        assertThat(testExecutionContext.getJsonReport()).exists();
        assertThat(testExecutionContext.getFeature()).exists();
        assertThat(testExecutionContext.getPrettyReport()).exists();

    }

    private void copyGlueJar() throws IOException {
        File glueJar = getGluesJar();
        File glueJarInWorkspace = new File(workspaceService.getRoot().getAbsolutePath() + File.separator + "glues-runnable.jar");
        if (glueJarInWorkspace.exists() && !glueJarInWorkspace.delete()) {
                throw new IllegalStateException("Unable to delete " + glueJar.getAbsolutePath());
        }
        Files.copy(glueJar.toPath(), glueJarInWorkspace.toPath());
    }

    private File getGluesJar() {
        File exampleGlueTargetDirectory = new File(".." + File.separator + "example" + File.separator + "target");
        for (File file : Objects.requireNonNull(exampleGlueTargetDirectory.listFiles())) {
            if (file.getName().endsWith("-jar-with-dependencies.jar")) {
                return file;
            }
        }
        throw new IllegalStateException("Unabla to find jar " + exampleGlueTargetDirectory.getAbsolutePath() + File.separator + "*-jar-with-dependencies.jar");
    }

}