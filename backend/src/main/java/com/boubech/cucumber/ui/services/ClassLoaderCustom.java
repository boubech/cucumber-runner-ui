package com.boubech.cucumber.ui.services;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Component
public class ClassLoaderCustom {

    private final ClassLoader classLoader;
    private final WorkspaceService workspaceService;

    public ClassLoaderCustom(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
        this.classLoader = init();
    }

    private URLClassLoader init() {
        List<File> files = this.workspaceService.listFiles();
        URL[] url = files.stream()
                .map(File::toURI)
                .map(uri -> {
                    try {
                        return uri.toURL();
                    } catch (MalformedURLException e) {
                        return null;
                    }
                })
                .collect(Collectors.toList())
                .toArray(new URL[0]);
        return new URLClassLoader(url);
    }

    public List<Class<?>> getClasses() throws IOException {
        return getClassNames()
                .stream()
                .map(className -> {
                    try {
                        return classLoader.loadClass(className);
                    } catch (ClassNotFoundException e) {
                        e.printStackTrace();
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    private List<String> getClassNames() throws IOException {
        List<String> classNames = new ArrayList<>();

        for(File file : this.workspaceService.listFiles()) {
            if (!file.getName().endsWith(".jar")) {
                continue;
            }
            try (ZipInputStream zip = new ZipInputStream(new FileInputStream(file))) {
                for (ZipEntry entry = zip.getNextEntry(); entry != null; entry = zip.getNextEntry()) {
                    if (!entry.isDirectory() && entry.getName().endsWith(".class")) {
                        // This ZipEntry represents a class. Now, what class does it represent?
                        String className = entry.getName().replace('/', '.'); // including ".class"
                        classNames.add(className.substring(0, className.length() - ".class".length()));
                    }
                }
            }
        }
        return classNames;
    }

    public ClassLoader getClassLoader() {
        return this.classLoader;
    }

}
