package com.boubech.cucumber.ui.converters;

import com.boubech.cucumber.ui.model.TestResponse;
import com.boubech.cucumber.ui.services.TestExecutionContext;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;

@Component
public class TestExecutionContextToTestResult {

    public TestResponse apply(TestExecutionContext testExecutionContext) throws IOException {
        TestResponse response = new TestResponse();
        response.setId(testExecutionContext.getIdentifier());
        response.reportHtmlId(testExecutionContext.getIdentifier());
        response.reportJson(testExecutionContext.getJsonReport().exists() ? Files.readAllLines(testExecutionContext.getJsonReport().toPath()) : null);
        response.reportPretty(testExecutionContext.getPrettyReport().exists() ? Files.readAllLines(testExecutionContext.getPrettyReport().toPath()) : null);

        switch(testExecutionContext.getState()) {
            case PENDING:
            case RUNNING:
                response.setStatus(TestResponse.StatusEnum.RUNNING);
                break;
            case FAILED:
                response.setStatus(TestResponse.StatusEnum.FAILED);
                break;
            case SUCCESS:
                response.setStatus(TestResponse.StatusEnum.SUCCESS);
                break;
            default:
                break;
        }

        return response;
    }
}
