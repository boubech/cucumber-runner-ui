package com.boubech.cucumber.ui.services;


import lombok.Builder;
import lombok.Getter;

import java.lang.reflect.Method;

@Builder
@Getter
public class Glue {
    private Class<?> clazz;
    private Method method;
    private Class<?> annotation;
    private String value;
}