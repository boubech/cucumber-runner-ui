package com.boubech.cucumber.ui.services;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class CucumberService {

    private final WorkspaceClassLoader workspaceClassLoader;
    private final String[] packageScanExclusions = new String[]{
            "org.assertj.core",
            "org.assertj.core",
            "io.cucumber",
            "cucumber.api",
            "net.jodah",
            "org.apiguardian",
            "org.picocontainer",
            "org.opentest4j",
            "org.hamcrest",
            "org.junit"
    };

    public CucumberService(WorkspaceClassLoader workspaceClassLoader) {
        this.workspaceClassLoader = workspaceClassLoader;
    }

    public List<Glue> getGluesDefinitions() {
        try {
            return this.workspaceClassLoader.getClasses()
                    .stream()
                    .filter(this::excludeThirdLib)
                    .map(this::getCucumberStep)
                    .flatMap(List::stream)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private boolean excludeThirdLib(Class<?> aClass) {
        for (String packageName : packageScanExclusions) {
            if (aClass.getPackageName().startsWith(packageName)) {
                return false;
            }
        }
        return true;
    }

    private List<Glue> getCucumberStep(Class<?> aClass) {
        try {
            return Arrays.stream(aClass.getMethods())
                    .map(this::getStepValue)
                    .flatMap(Collection::stream)
                    .collect(Collectors.toList());
        } catch (Throwable e) {
            return new ArrayList<>();
        }
    }


    public List<Class<?>> getCucumberGlueClass() throws IOException {
        return this.workspaceClassLoader.getClasses()
                .stream()
                .filter(this::excludeThirdLib)
                .filter(this::hasStepDef)
                .collect(Collectors.toList());
    }

    private boolean hasStepDef(Class<?> clazz) {
        try {
            return Arrays.stream(clazz.getMethods()).anyMatch(method -> !getStepValue(method).isEmpty());
        } catch (Throwable e) {
            return false;
        }
    }

    private List<Glue> getStepValue(Method method) {
        if (method.getAnnotations() == null || method.getAnnotations().length == 0) {
            return Collections.emptyList();
        }
        return Arrays.stream(method.getAnnotations())
                .filter(annotation ->
                        annotation.toString().startsWith("@io.cucumber.java"))
                .map(annotation -> {
                    try {
                        Method getter = method.getAnnotation(annotation.annotationType()).getClass().getMethod("value");
                        return Glue.builder()
                                .clazz(method.getDeclaringClass())
                                .method(method)
                                .value(getter.invoke(method.getAnnotation(annotation.annotationType())).toString())
                                .annotation(annotation.annotationType())
                                .build();
                    } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

}
