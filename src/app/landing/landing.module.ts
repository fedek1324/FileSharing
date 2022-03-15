import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LandingComponent } from './landingComp/landing.component';
import { LandingRoutingModule} from './landing-routing.module';
import { AccQuestionComponent } from './acc-question/acc-question.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule} from '../shared/shared.module';



@NgModule({
  declarations: [
    LandingComponent,
    AccQuestionComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    LandingRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
})
export class LandingModule { }
