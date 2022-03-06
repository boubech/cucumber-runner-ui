package com.boubech.cucumber.ui.websocket;

import com.boubech.cucumber.ui.services.TestRunnerCommandLine;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class LoggerService {

    private final Logger logger = Logger.getLogger(TestRunnerCommandLine.class.getName());
    private final SimpMessageSendingOperations messagingTemplate;

    public LoggerService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void log(String message) {
        logger.info(message);
        messagingTemplate.convertAndSend("/topic/progress", new LogMessage("INFO", message));
    }

}
