package com.boubech.cucumber.ui.converters;

import com.boubech.cucumber.ui.model.FeatureRunnerResponse;
import com.boubech.cucumber.ui.services.TestExecutionContext;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;

import static com.boubech.cucumber.ui.model.FeatureRunnerResponse.StateEnum.*;

@Component
public class TestExecutionContextToFeatureRunnerResponse {

    public FeatureRunnerResponse apply(TestExecutionContext testExecutionContext) throws IOException {
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
