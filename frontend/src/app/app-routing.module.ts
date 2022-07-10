import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTradeTestComponent } from './add-trade-test/add-trade-test.component';
import { SandboxGeneratorComponent } from './sandbox-generator/sandbox-generator.component';

const routes: Routes = [
  { path: "add-trade-test/:jurisdiction/:sourceSystem/:assetClass/:upi", component: AddTradeTestComponent },
  { path: "generate-sandbox", component: SandboxGeneratorComponent }
  // { path: "", redirectTo: "generate-sandbox", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
