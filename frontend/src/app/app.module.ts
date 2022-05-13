import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CucumberUiComponent} from './@cucumber-ui/cucumber-ui.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {AnsiToHtml} from "./@cucumber-ui/pipe/ansi-to-html.pipe";
import {SafeHtml} from "./@cucumber-ui/pipe/safe-html.pipe";
import {SpaceToHtml} from "./@cucumber-ui/pipe/space-to-html.pipe";
import {ConsoleUiComponent} from "./@cucumber-ui/console-ui/console-ui.component";
import {SafeResourceUrlPipe} from "./@cucumber-ui/pipe/safe-resource-url.pipe";
import {CucumberUiModule} from "./@cucumber-ui/cucumber-ui.module";
import {HtmlReportComponent} from "./@cucumber-ui/html-report/html-report.component";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTabsModule} from "@angular/material/tabs";
import {GlueDictionary} from './@cucumber-ui/glue-dictionary/glue-dictionary.component';
import {RxStompService} from "@stomp/ng2-stompjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {MatSidenavModule} from "@angular/material/sidenav";

@NgModule({
  declarations: [
    AppComponent,
    CucumberUiComponent,
    ConsoleUiComponent,
    HtmlReportComponent,
    GlueDictionary,
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
        CucumberUiModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatGridListModule,
        MatTabsModule,
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatSidenavModule
    ],
  providers: [
    RxStompService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
