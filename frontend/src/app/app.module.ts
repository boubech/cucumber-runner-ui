import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CucumberUiComponent} from './@cucumber-ui/cucumber-ui.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {AnsiToHtml} from "./@cucumber-ui/pipe/ansi-to-html.pipe";
import {SafeHtml} from "./@cucumber-ui/pipe/safe-html.pipe";
import {SpaceToHtml} from "./@cucumber-ui/pipe/space-to-html.pipe";
import {ConsoleUiComponent} from "./@cucumber-ui/console-ui/console-ui.component";
import {SafeResourceUrlPipe} from "./@cucumber-ui/pipe/safe-resource-url.pipe";
import {CucumberUiModule} from "./@cucumber-ui/cucumber-ui.module";
import {HtmlReportComponent} from "./@cucumber-ui/html-report/html-report.component";

@NgModule({
  declarations: [
    AppComponent,
    CucumberUiComponent,
    ConsoleUiComponent,
    HtmlReportComponent,
    AnsiToHtml,
    SafeHtml,
    SpaceToHtml,
    SafeResourceUrlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    CucumberUiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
