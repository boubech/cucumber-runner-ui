import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { FileItemComponent } from './file-explorer/file-item/file-item.component';
import {MatIconModule} from "@angular/material/icon";
import { FeatureEditorComponent } from './feature-editor/feature-editor.component';

@NgModule({
  declarations: [
    FileExplorerComponent,
    FileItemComponent,
    FeatureEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  exports: [
    FileExplorerComponent,
    FeatureEditorComponent
  ],
  providers: []
})
export class CucumberUiModule {
}
