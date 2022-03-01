package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.services.CucumberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GlueApiDelegateImpl implements GluesApiDelegate {

    private final CucumberService cucumberService;

    public GlueApiDelegateImpl(CucumberService cucumberService) {
        this.cucumberService = cucumberService;
    }

    @Override
    public ResponseEntity<List<String>> getGlues() {
        List<String> body = this.cucumberService.getGluesDefinitions();
        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
