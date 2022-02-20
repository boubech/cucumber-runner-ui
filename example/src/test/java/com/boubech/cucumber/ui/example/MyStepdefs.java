package com.boubech.cucumber.ui.example;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.assertj.core.api.Assertions.assertThat;


public class MyStepdefs {

    int param;

    @Given("un parametre {int}")
    public void set(int arg0) {
        this.param = arg0;
    }

    @When("un ajout de {int}")
    public void add(int arg0) {
        param++;
    }

    @Then("un résultat {int}")
    public void verify(int arg0) {
        assertThat(param).isEqualTo(arg0);
    }
}
