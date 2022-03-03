import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CucumberUiComponent } from './@cucumber-ui/cucumber-ui.component';

const routes: Routes = [
  { path: '', component: CucumberUiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
