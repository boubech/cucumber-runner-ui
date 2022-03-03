import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { FileItemComponent } from './file-explorer/file-item/file-item.component';

@NgModule({
  declarations: [
    FileExplorerComponent,
    FileItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  exports: [
    FileExplorerComponent
  ],
  providers: []
})
export class CucumberUiModule {
}
