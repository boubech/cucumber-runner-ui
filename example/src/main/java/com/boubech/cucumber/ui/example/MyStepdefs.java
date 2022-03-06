package com.boubech.cucumber.ui.example;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class MyStepdefs {

    int param;

    @Given("un parametre {int}")
    public void set(int toInit) {
        this.param = toInit;
    }

    @When("un ajout de {int}")
    public void add(int toAdd) {
        param = param + toAdd;
    }

    @Then("un résultat {int}")
    public void verify(int toTest) {
        assertThat(param).isEqualTo(toTest);
    }

    @Then("un resultat {int}")
    public void verify2(int toTest) {
        assertThat(param).isEqualTo(toTest);
    }
}
