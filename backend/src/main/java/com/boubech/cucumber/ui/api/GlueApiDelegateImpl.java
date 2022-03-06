package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.converters.GlueToGlueResponse;
import com.boubech.cucumber.ui.model.GlueResponse;
import com.boubech.cucumber.ui.services.CucumberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class GlueApiDelegateImpl implements GluesApiDelegate {

    private final GlueToGlueResponse glueToGlueResponse;
    private final CucumberService cucumberService;

    public GlueApiDelegateImpl(GlueToGlueResponse glueToGlueResponse, CucumberService cucumberService) {
        this.glueToGlueResponse = glueToGlueResponse;
        this.cucumberService = cucumberService;
    }

    @Override
    public ResponseEntity<List<GlueResponse>> getGlues() {
        List<GlueResponse> body = this.cucumberService.getGluesDefinitions().stream().map(glueToGlueResponse::apply).collect(Collectors.toList());
        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
