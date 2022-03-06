package com.boubech.cucumber.ui.services;


import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class TestRunnerService {

    private final TestRunnerCommandLine testRunnerCommandLine;
    private final Map<String,TestExecutionContext> tests = new HashMap<>();

    public TestRunnerService(TestRunnerCommandLine testRunnerCommandLine) {
        this.testRunnerCommandLine = testRunnerCommandLine;
    }

    public void run(TestExecutionContext testExecutionContext) throws IOException {
        tests.put(testExecutionContext.getIdentifier(), testExecutionContext);
        testExecutionContext.setState(TestExecutionContext.State.RUNNING);
        this.testRunnerCommandLine.run(testExecutionContext, this::onSuccess, this::onFailed);
    }

    public TestExecutionContext getFromId(String id) {
        return tests.get(id);
    }

    public void onSuccess(TestExecutionContext testExecutionContext) {
        testExecutionContext.setState(TestExecutionContext.State.SUCCESS);
    }

    public void onFailed(TestExecutionContext testExecutionContext) {
        testExecutionContext.setState(TestExecutionContext.State.FAILED);
    }
}
