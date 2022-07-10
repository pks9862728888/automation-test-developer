import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SandboxGeneratorComponent } from './sandbox-generator/sandbox-generator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { AddTradeTestComponent } from './add-trade-test/add-trade-test.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SandboxGeneratorComponent,
    AddTradeTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
