package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.model.FeatureRunnerRequest;
import com.boubech.cucumber.ui.model.FeatureRunnerResponse;
import com.boubech.cucumber.ui.services.CucumberService;
import com.boubech.cucumber.ui.services.TestExecutionContext;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class FeaturesApiDelegateImpl implements FeaturesApiDelegate {

    private final WorkspaceService workspaceService;
    private final CucumberService cucumberService;

    public FeaturesApiDelegateImpl(WorkspaceService workspaceService, CucumberService cucumberService) {
        this.workspaceService = workspaceService;
        this.cucumberService = cucumberService;
    }

    @Override
    public ResponseEntity<FeatureRunnerResponse> runFeature(FeatureRunnerRequest featureRunnerRequest) {
        try {
            TestExecutionContext testExecutionContext = this.workspaceService.createNewTestExecutionContext();
            Files.write(testExecutionContext.getFeature().toPath(), featureRunnerRequest.getFeature(), Charset.defaultCharset());
            this.cucumberService.run(testExecutionContext);
            FeatureRunnerResponse featureRunnerResponse = convertToFeatureRunnerResponse(testExecutionContext);
            return new ResponseEntity<>(featureRunnerResponse, HttpStatus.OK);
        } catch (IOException e) {
            FeatureRunnerResponse response = new FeatureRunnerResponse();
            response.reportPretty(Arrays.stream(e.getStackTrace()).map(StackTraceElement::toString).collect(Collectors.toList()));
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private FeatureRunnerResponse convertToFeatureRunnerResponse(TestExecutionContext testExecutionContext) throws IOException {
        FeatureRunnerResponse featureRunnerResponse = new FeatureRunnerResponse();
        featureRunnerResponse.setId((long) testExecutionContext.getIdentifier());
        featureRunnerResponse.reportHtmlId((long) testExecutionContext.getIdentifier());
        featureRunnerResponse.reportJson(Files.readAllLines(testExecutionContext.getJsonReport().toPath()));
        featureRunnerResponse.reportPretty(Files.readAllLines(testExecutionContext.getPrettyReport().toPath()));
        return featureRunnerResponse;
    }

}
