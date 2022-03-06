package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.model.InlineObject;
import com.boubech.cucumber.ui.services.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class DirectoryApiDelegateImpl implements DirectoryApiDelegate {

    private final WorkspaceService workspaceService;

    public DirectoryApiDelegateImpl(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    public ResponseEntity<String> makeDirectory(InlineObject inlineObject) {
        try {
            workspaceService.makeDirectory(inlineObject.getDirectory());
            return ResponseEntity.ok().body("created");
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseEntity.internalServerError().body(exception.getMessage());
        }
    }
}
