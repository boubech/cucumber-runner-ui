package com.boubech.cucumber.ui.services;

import com.boubech.cucumber.ui.websocket.LoggerService;
import org.apache.commons.lang3.SystemUtils;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

import java.util.stream.Collectors;

@Component
public class TestRunnerCommandLine {

    private final LoggerService loggerService;
    private final CucumberService cucumberService;
    private final WorkspaceService workspaceService;

    public TestRunnerCommandLine(LoggerService loggerService, CucumberService cucumberService, WorkspaceService workspaceService) {
        this.loggerService = loggerService;
        this.cucumberService = cucumberService;
        this.workspaceService = workspaceService;
    }

    public void run(TestExecutionContext testExecutionContext,
                    Consumer<TestExecutionContext> onSuccess,
                    Consumer<TestExecutionContext> onFailed) throws IOException {
        List<Class<?>> gluesClasses = cucumberService.getCucumberGlueClass();

        List<String> command = getInterpreterCommand();
        List<String> interpreterArgs = new ArrayList<>();
        interpreterArgs.add("java");
        Optional.ofNullable(testExecutionContext.getEnvironments().get("JAVA_OPT")).ifPresent(interpreterArgs::add);
        interpreterArgs.add("-cp");
        interpreterArgs.add(getClassPath());
        interpreterArgs.add("-Dcucumber.publish.quiet=true");
        interpreterArgs.add("io.cucumber.core.cli.Main");
        interpreterArgs.add(getRelativePath(testExecutionContext.getFeature(), workspaceService.getRoot()));

        gluesClasses.forEach(clazz -> addGlueToArg(interpreterArgs, clazz));

        addPluginToArgs(interpreterArgs, "html:" + getRelativePath(testExecutionContext.getHtmlReport(), workspaceService.getRoot()));
        addPluginToArgs(interpreterArgs, "json:" + getRelativePath(testExecutionContext.getJsonReport(), workspaceService.getRoot()));
        addPluginToArgs(interpreterArgs, "pretty:" + getRelativePath(testExecutionContext.getPrettyReport(), workspaceService.getRoot()));

        this.loggerService.log(" \u001b[36m " + this.workspaceService.getRoot().getName() + "/ ~\u001b[0m " + String.join(" ", command) + " '" + String.join(" ", interpreterArgs) + "'");

        command.add(String.join(" ", interpreterArgs));


        CompletableFuture.runAsync(() -> {
            try {
                boolean successfuly = this.runExec(testExecutionContext, command.toArray(new String[0]));
                if (successfuly) {
                    onSuccess.accept(testExecutionContext);
                } else {
                    onFailed.accept(testExecutionContext);
                }
            } catch (IOException e) {
                onFailed.accept(testExecutionContext);
            }
        });
    }

    public String getRelativePath(File file, File relativeFrom) {
        Path pathAbsolute = Paths.get(file.getAbsolutePath());
        Path pathBase = Paths.get(relativeFrom.getAbsolutePath());
        Path pathRelative = pathBase.relativize(pathAbsolute);
        return pathRelative.toString();
    }

    private List<String> getInterpreterCommand() {
        List<String> arguments = new ArrayList<>();
        if (SystemUtils.IS_OS_WINDOWS) {
            arguments.add("cmd");
            arguments.add("/c");
        } else {
            arguments.add("bash");
            arguments.add("-c");
        }
        return arguments;
    }

    private String getClassPath() {
        return workspaceService.listFiles()
                .stream()
                .map(File::getName)
                .filter(name -> name.endsWith(".jar"))
                .collect(Collectors.joining(SystemUtils.IS_OS_WINDOWS ? ";" : ":"));
    }

    private boolean runExec(TestExecutionContext testExecutionContext, String... args) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(args);
        builder.environment().putAll(testExecutionContext.getEnvironments());
        builder.directory(workspaceService.getRoot());
        builder.redirectErrorStream(true);
        Process p = builder.start();
        try (BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
             FileWriter fw = new FileWriter(testExecutionContext.getLogFile(), StandardCharsets.UTF_8, true)) {
            String line;
            do {
                line = r.readLine();
                if (line == null) {
                    continue;
                }
                this.loggerService.log(line);
                testExecutionContext.getLog().add(line);
                fw.write(line + "\n");
            } while (p.isAlive());

            return p.exitValue() == 0;
        }
    }

    private void addPluginToArgs(List<String> arguments, String plugin) {
        arguments.add("--plugin");
        arguments.add(plugin);
    }


    private void addGlueToArg(List<String> arguments, Class<?> clazz) {
        arguments.add("--glue");
        arguments.add(clazz.getPackageName());
    }

}
