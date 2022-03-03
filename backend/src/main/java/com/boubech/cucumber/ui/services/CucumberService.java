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

    private final DynamiqueClassLoadService dynamiqueClassLoadService;
    private final String[] packageScanExclusions = new String[]{
            "org.assertj.core",
            "org.assertj.core",
            "io.cucumber",
            "cucumber.api",
            "net.jodah",
            "org.apiguardian",
            "org.picocontainer",
            "org.junit"
    };

    private static final Set<Class<Annotation>> CUCUMBER_ANNOTATION = new Reflections("io.cucumber.java", new SubTypesScanner(false))
            .getSubTypesOf(Object.class)
            .stream()
            .filter(Class::isAnnotation)
            .map(annotation -> ((Class<Annotation>) annotation))
            .collect(Collectors.toSet());

    public CucumberService(DynamiqueClassLoadService dynamiqueClassLoadService) {
        this.dynamiqueClassLoadService = dynamiqueClassLoadService;
    }

    public List<String> getGluesDefinitions() {
        try {
            return this.dynamiqueClassLoadService.getClasses()
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

    private List<String> getCucumberStep(Class<?> aClass) {
        try {
            return Arrays.stream(aClass.getMethods())
                    .map(this::getStepValue)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
        } catch (Throwable e) {
            return Collections.emptyList();
        }
    }


    private List<Class<?>> getCucumberGlueClass() throws IOException {
        return this.dynamiqueClassLoadService.getClasses()
                .stream()
                .filter(this::excludeThirdLib)
                .filter(clazz -> Arrays.stream(clazz.getMethods()).anyMatch(method -> getStepValue(method).isPresent()))
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

    public void run(TestExecutionContext testExecutionContext) throws IOException {
        ClassLoader classLoader = dynamiqueClassLoadService.get();
        List<Class<?>> gluesClasses = getCucumberGlueClass();

        List<String> arguments = new ArrayList<>();
        arguments.add(testExecutionContext.getFeature().getAbsolutePath());

        gluesClasses.forEach(clazz -> {
            try {
                classLoader.loadClass(clazz.getName());
                addGlueToArg(arguments, clazz);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        });

        addPluginToArgs(arguments, "html:" + testExecutionContext.getHtmlReport().getAbsolutePath());
        addPluginToArgs(arguments, "json:" + testExecutionContext.getJsonReport().getAbsolutePath());
        addPluginToArgs(arguments, "pretty:" + testExecutionContext.getPrettyReport().getAbsolutePath());

        io.cucumber.core.cli.Main.run(arguments.toArray(String[]::new), classLoader);
    }

    private void addPluginToArgs(List<String> arguments, String plugin) {
        arguments.add("--plugin");
        arguments.add(plugin);
    }


    private void addGlueToArg(List<String> arguments, Class<?> clazz) {
        arguments.add("--glue");
        arguments.add(clazz.getPackageName());
    }

}
