package com.boubech.cucumber.ui.converters;

import com.boubech.cucumber.ui.model.FileResponse;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.Arrays;
import java.util.Base64;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class FileToFileResponse {

    public FileResponse apply(File file) {
        FileResponse fileResponse = new FileResponse();
        fileResponse.setName(file.getName());
        fileResponse.setPath(file.getPath());
        fileResponse.isDirectory(file.isDirectory());
        fileResponse.setPathB64(new String(Base64.getEncoder().encode(file.getPath().getBytes())));
        fileResponse.setFiles(file.isDirectory() ?
                Stream.concat(Arrays.stream(Objects.requireNonNull(file.listFiles()))
                                .filter(File::isDirectory)
                                .map(this::apply)
                                .sorted((f1, f2) -> String.CASE_INSENSITIVE_ORDER.compare(f1.getName(), f2.getName())),
                        Arrays.stream(Objects.requireNonNull(file.listFiles()))
                                .filter(File::isFile)
                                .map(this::apply)
                                .sorted((f1, f2) -> String.CASE_INSENSITIVE_ORDER.compare(f1.getName(), f2.getName()))
                ).collect(Collectors.toList()) : null);
        return fileResponse;
    }
}
