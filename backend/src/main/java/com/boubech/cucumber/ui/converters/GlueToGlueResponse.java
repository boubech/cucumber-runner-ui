package com.boubech.cucumber.ui.converters;

import com.boubech.cucumber.ui.model.GlueResponse;
import com.boubech.cucumber.ui.services.Glue;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Component
public class GlueToGlueResponse {

    public GlueResponse apply(Glue glue) {
        GlueResponse response = new GlueResponse();
        response.setType(formatStepPrefix(glue.getAnnotation()));
        response.setValue(glue.getValue());
        response.setComment(glue.getClazz().getSimpleName() + "." + glue.getMethod().getName() + "(" + Arrays.stream(glue.getMethod().getParameters())
                .map(p -> p.getType().getSimpleName() + " " + p.getName())
                .collect(Collectors.joining(",")) + ")");
        response.setClazz(glue.getClazz().getSimpleName());
        response.setMethod(glue.getMethod().getName());
        response.setArguments(Arrays.stream(glue.getMethod().getParameters()).map(p -> p.getType().getSimpleName() + " " + p.getName()).collect(Collectors.toList()));
        return response;
    }

    private String formatStepPrefix(Class<?> clazz) {
        switch (clazz.getSimpleName()) {
            case "Etantdonné":
                return "Etant donné";
            default:
                return clazz.getSimpleName();
        }
    }
}
