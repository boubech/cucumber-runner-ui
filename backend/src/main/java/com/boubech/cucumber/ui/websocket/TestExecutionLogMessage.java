package com.boubech.cucumber.ui.websocket;

import com.boubech.cucumber.ui.services.TestExecutionContext;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TestExecutionLogMessage {
    private String testExecutionContextIdentifier;
    private String message;
}
