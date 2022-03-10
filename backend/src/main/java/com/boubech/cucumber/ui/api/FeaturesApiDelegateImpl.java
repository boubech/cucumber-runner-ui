package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.model.FeatureRunnerOptionRequest;
import com.boubech.cucumber.ui.model.FeatureRunnerRequest;
import com.boubech.cucumber.ui.model.FeatureRunnerResponse;
import com.boubech.cucumber.ui.services.TestExecutionContext;
import com.boubech.cucumber.ui.services.TestRunnerCommandLine;
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

import static com.boubech.cucumber.ui.model.FeatureRunnerResponse.StateEnum.*;

@Component
public class FeaturesApiDelegateImpl implements FeaturesApiDelegate {

    private final WorkspaceService workspaceService;
    private final TestRunnerCommandLine testRunnerService;

    public FeaturesApiDelegateImpl(WorkspaceService workspaceService,
                                   TestRunnerCommandLine testRunnerService) {
        this.workspaceService = workspaceService;
        this.testRunnerService = testRunnerService;
    }

    @Override
    public ResponseEntity<FeatureRunnerResponse> runFeature(FeatureRunnerRequest featureRunnerRequest) {
        try {
            TestExecutionContext testExecutionContext = buildNewTestExecution(featureRunnerRequest);
            runFeature(testExecutionContext);
            if (testExecutionContext.getState().equals(TestExecutionContext.State.ERROR)) {
                throw new IllegalStateException("Error to run test" + String.join("\n", testExecutionContext.getLog()));
            } else if (testExecutionContext.getState().equals(TestExecutionContext.State.FAILED)) {
                return new ResponseEntity<>(convertToFeatureRunnerResponse(testExecutionContext), HttpStatus.BAD_REQUEST);
            } else {
                return new ResponseEntity<>(convertToFeatureRunnerResponse(testExecutionContext), HttpStatus.OK);
            }
        } catch (IOException | InterruptedException | IllegalStateException e) {
            e.printStackTrace();
            FeatureRunnerResponse response = new FeatureRunnerResponse();
            response.setState(ERROR);
            response.reportPretty(Arrays.stream(e.getStackTrace()).map(StackTraceElement::toString).collect(Collectors.toList()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private TestExecutionContext buildNewTestExecution(FeatureRunnerRequest featureRunnerRequest) throws IOException {
        Map<String, String> properties = featureRunnerRequest.getOptions().stream().filter(o -> o.getType().equals(FeatureRunnerOptionRequest.TypeEnum.PROPERTY)).collect(Collectors.toMap(FeatureRunnerOptionRequest::getKey, FeatureRunnerOptionRequest::getValue));
        Map<String, String> environments = featureRunnerRequest.getOptions().stream().filter(o -> o.getType().equals(FeatureRunnerOptionRequest.TypeEnum.ENVIRONMENT)).collect(Collectors.toMap(FeatureRunnerOptionRequest::getKey, FeatureRunnerOptionRequest::getValue));
        TestExecutionContext testExecutionContext = this.workspaceService.createNewTestExecutionContext(properties, environments);
        Files.write(testExecutionContext.getFeature().toPath(), featureRunnerRequest.getFeature(), StandardCharsets.UTF_8);
        return testExecutionContext;
    }

    private void runFeature(TestExecutionContext testExecutionContext) throws IOException, InterruptedException {
        testExecutionContext.setState(TestExecutionContext.State.RUNNING);
        this.testRunnerService.run(testExecutionContext, t -> t.setState(TestExecutionContext.State.SUCCESS), t -> {
            if (testExecutionContext.getJsonReport().exists()) {
                t.setState(TestExecutionContext.State.FAILED);
            } else {
                t.setState(TestExecutionContext.State.ERROR);
            }
        });
        waitUntilTextExecutionIsDone(testExecutionContext);
    }

    private void waitUntilTextExecutionIsDone(TestExecutionContext testExecutionContext) throws InterruptedException {
        do {
            Thread.sleep(100);
        } while (testExecutionContext.getState().equals(TestExecutionContext.State.RUNNING));
    }

    private FeatureRunnerResponse convertToFeatureRunnerResponse(TestExecutionContext testExecutionContext) throws IOException {
        FeatureRunnerResponse featureRunnerResponse = new FeatureRunnerResponse();
        featureRunnerResponse.setId(testExecutionContext.getIdentifier());
        featureRunnerResponse.reportHtmlId(testExecutionContext.getHtmlReport().exists() ? testExecutionContext.getIdentifier() : null);
        featureRunnerResponse.reportJson(testExecutionContext.getJsonReport().exists() ? Files.readAllLines(testExecutionContext.getJsonReport().toPath()) : null);
        featureRunnerResponse.reportPretty(testExecutionContext.getPrettyReport().exists() ? Files.readAllLines(testExecutionContext.getPrettyReport().toPath()) : testExecutionContext.getLog());
        switch (testExecutionContext.getState()) {
            case ERROR:
                featureRunnerResponse.setState(ERROR);
                break;
            case SUCCESS:
                featureRunnerResponse.setState(SUCCESS);
                break;
            case FAILED:
                featureRunnerResponse.setState(FAILURE);
                break;
            default:
                break;
        }
        return featureRunnerResponse;
    }

}
