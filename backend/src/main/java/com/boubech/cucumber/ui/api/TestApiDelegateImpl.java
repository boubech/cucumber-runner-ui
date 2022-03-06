package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.converters.TestExecutionContextToTestResult;
import com.boubech.cucumber.ui.model.FeatureRunnerOptionRequest;
import com.boubech.cucumber.ui.model.TestRequest;
import com.boubech.cucumber.ui.model.TestResponse;
import com.boubech.cucumber.ui.services.TestExecutionContext;
import com.boubech.cucumber.ui.services.TestRunnerService;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class TestApiDelegateImpl implements TestApiDelegate {

    private final WorkspaceService workspaceService;
    private final TestRunnerService testRunnerService;
    private final TestExecutionContextToTestResult testExecutionContextToTestResult;

    public TestApiDelegateImpl(WorkspaceService workspaceService, TestRunnerService testRunnerService, TestExecutionContextToTestResult testExecutionContextToTestResult) {
        this.workspaceService = workspaceService;
        this.testRunnerService = testRunnerService;
        this.testExecutionContextToTestResult = testExecutionContextToTestResult;
    }


    @Override
    public ResponseEntity<TestResponse> runTest(TestRequest testRequest) {
        try {
            Map<String, String> properties = testRequest.getOptions().stream().filter(o -> o.getType().equals(FeatureRunnerOptionRequest.TypeEnum.PROPERTY)).collect(Collectors.toMap(FeatureRunnerOptionRequest::getKey, FeatureRunnerOptionRequest::getValue));
            Map<String, String> environments = testRequest.getOptions().stream().filter(o -> o.getType().equals(FeatureRunnerOptionRequest.TypeEnum.ENVIRONMENT)).collect(Collectors.toMap(FeatureRunnerOptionRequest::getKey, FeatureRunnerOptionRequest::getValue));
            TestExecutionContext testExecutionContext = this.workspaceService.createNewTestExecutionContext(properties, environments);
            Files.write(testExecutionContext.getFeature().toPath(), testRequest.getFeature(), StandardCharsets.UTF_8);
            this.testRunnerService.run(testExecutionContext);
            return new ResponseEntity<>(testExecutionContextToTestResult.apply(testExecutionContext), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            TestResponse response = new TestResponse();
            response.reportPretty(Arrays.stream(e.getStackTrace()).map(StackTraceElement::toString).collect(Collectors.toList()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<TestResponse> getTest(String testId) {
        try {
            return new ResponseEntity<>(this.testExecutionContextToTestResult.apply(this.testRunnerService.getFromId(testId)), HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            TestResponse response = new TestResponse();
            response.reportPretty(Arrays.stream(e.getStackTrace()).map(StackTraceElement::toString).collect(Collectors.toList()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
