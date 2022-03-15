import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingModule } from './landing/landing.module';
import { FooterComponent } from './footer/footer.component';
import { CabinetModule } from './cabinet/cabinet.module';
import { SharedModule } from './shared/shared.module';

import {UserService} from './shared/services/user.service'; 
import {FileService} from './shared/services/file.service';
import { AuthService} from './shared/services/authService';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LandingModule,
    CabinetModule,
    SharedModule,
  ],
  providers: [UserService, FileService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
