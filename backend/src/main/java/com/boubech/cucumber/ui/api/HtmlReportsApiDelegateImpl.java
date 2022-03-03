package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.services.TestExecutionContext;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class HtmlReportsApiDelegateImpl implements HtmlReportsApiDelegate {

    private final WorkspaceService workspaceService;

    public HtmlReportsApiDelegateImpl(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }


    public ResponseEntity<String> getHtmlReport(Integer reportId) {
        try {
            return this.workspaceService.findTestExecutionContextById(reportId)
                    .map(TestExecutionContext::getHtmlReportAsString)
                    .map(lines -> String.join("", lines))
                    .map(ResponseEntity::ok)
                    .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
