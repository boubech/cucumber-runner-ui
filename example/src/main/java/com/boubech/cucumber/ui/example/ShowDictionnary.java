package com.boubech.cucumber.ui.example;

import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ShowDictionnary {

    private static final Class[] stepDefinitionsClasses = {MyStepdefs.class};


    public static void main(String[] args) {
        System.out.println("Recherche des step definitions");
        Map<Class<?>, List<Annotation>> stepdefinitions = findCucumberAnnotations(stepDefinitionsClasses);
        showStepDef(stepdefinitions);
        System.out.println("Fin de recherche des step definitions");
    }

    private static Map<Class<?>, List<Annotation>> findCucumberAnnotations(Class[] classes) {
        Map<Class<?>, List<Annotation>> stepdefinitions = new HashMap<>();
        for (Class<?> classe : classes) {
            System.out.println("Recherche dans classe " + classe.getName());
            for (Method method : classe.getMethods()) {
                System.out.println("Recherche dans classe " + classe.getName() + "::" + method.getName());
                for (Annotation annotation : method.getDeclaredAnnotations()) {
                    System.out.println("Recherche dans classe " + classe.getName() + "::" + method.getName() + " @" + annotation.annotationType());
                    if (annotation.annotationType().getPackageName().startsWith("io.cucumber.java")) {
                        stepdefinitions.computeIfAbsent(classe, key -> new ArrayList<>());
                        stepdefinitions.get(classe).add(annotation);
                    }
                }
            }
        }
        return stepdefinitions;
    }

    private static void showStepDef(Map<Class<?>, List<Annotation>> stepdefinitions) {

        stepdefinitions.forEach((classe, annotations) -> annotations.forEach(annotation -> {
            try {
                Method valueGetter = annotation.getClass().getMethod("value");
                String value = valueGetter.invoke(annotation).toString();
                System.out.println(classe.getSimpleName() + " : " + value);
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }));
    }
}
