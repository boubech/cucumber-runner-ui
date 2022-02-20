package com.boubech.cucumber.ui.services;

import org.reflections.Reflections;
import org.reflections.scanners.SubTypesScanner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class CucumberService {

    private final ClassLoaderCustom classLoaderCustom;

    private static final Set<Class<Annotation>> CUCUMBER_ANNOTATION = new Reflections("io.cucumber.java", new SubTypesScanner(false))
            .getSubTypesOf(Object.class)
            .stream()
            .filter(Class::isAnnotation)
            .map(annotation -> ((Class<Annotation>) annotation))
            .collect(Collectors.toSet());

    public CucumberService(com.boubech.cucumber.ui.services.ClassLoaderCustom classLoaderCustom) {
        this.classLoaderCustom = classLoaderCustom;
    }

    public List<String> getGlues() {
        try {
            return this.classLoaderCustom.getClasses()
                    .stream()
                    .map(this::getCucumberStep)
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private List<String> getCucumberStep(Class<?> aClass) {
        return Arrays  .stream(aClass.getMethods())
                .map(this::getStepValue)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    private Optional<String> getStepValue(Method method) {
        Optional<Class<Annotation>> optionalAnnotation = CUCUMBER_ANNOTATION.stream()
                .filter(method::isAnnotationPresent)
                .findFirst();
        return optionalAnnotation.map(annotation -> {
            try {
                Method getter = method.getAnnotation(annotation).getClass().getMethod("value");
                return annotation.getName() + ":" + getter.invoke(method.getAnnotation(annotation));
            } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
                e.printStackTrace();
                return null;
            }
        });
    }
}
