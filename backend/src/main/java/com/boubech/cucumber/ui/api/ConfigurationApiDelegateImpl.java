package com.boubech.cucumber.ui.api;

import com.boubech.cucumber.ui.model.ModelConfiguration;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties("configuration")
public class ConfigurationApiDelegateImpl implements ConfigurationApiDelegate {

    private Map<String, String> environments;
    private Map<String, String> properties;

    @Override
    public ResponseEntity<List<ModelConfiguration>> getConfiguration() {
        List<ModelConfiguration> configurations = new ArrayList<>();
        environments.entrySet().stream().forEach(i -> {
            ModelConfiguration configuration = new ModelConfiguration();
            configuration.setKey(i.getKey());
            configuration.setValue(i.getValue());
            configuration.setType(ModelConfiguration.TypeEnum.ENVIRONMENT);
            configurations.add(configuration);
        });
        properties.entrySet().stream().forEach(i -> {
            ModelConfiguration configuration = new ModelConfiguration();
            configuration.setKey(i.getKey());
            configuration.setValue(i.getValue());
            configuration.setType(ModelConfiguration.TypeEnum.PROPERTY);
            configurations.add(configuration);
        });
        return ResponseEntity.ok(configurations);
    }
}
