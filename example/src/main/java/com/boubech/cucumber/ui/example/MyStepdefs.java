package com.boubech.cucumber.ui.example;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;



import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


public class MyStepdefs {

    int param;

    @Given("an integer {int}")
    public void set(int integerToDefine) {
        this.param = integerToDefine;
    }

    @When("add {int}")
    public void add(int integerToAdd) {
        param = param + integerToAdd;
    }

    @Then("the result is {int}")
    public void verify(int integerToVerify) {
        assertThat(param).isEqualTo(integerToVerify);
    }

}
