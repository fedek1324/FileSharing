import {NgModule} from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {LandingComponent} from './landingComp/landing.component';



const routes: Routes = [
  {path: 'landing', component: LandingComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class LandingRoutingModule {}
