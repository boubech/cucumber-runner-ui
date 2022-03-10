import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { FileItemComponent } from './file-explorer/file-item/file-item.component';
import {MatIconModule} from "@angular/material/icon";
import { FeatureEditorComponent } from './feature-editor/feature-editor.component';
import { RunnerSettingsComponent } from './runner-settings/runner-settings.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    FileExplorerComponent,
    FileItemComponent,
    FeatureEditorComponent,
    RunnerSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule
  ],
  exports: [
    FileExplorerComponent,
    FeatureEditorComponent,
    RunnerSettingsComponent
  ],
  providers: []
})
export class CucumberUiModule {
}
