import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authService';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit{
  constructor(private authService : AuthService,
              private router : Router) { }

  ngOnInit() {
    setTimeout(function (){ scroll(0,0); }, 50);
    console.log('landing init')
    if (this.authService.isLoggedIn()) {
      console.log('logged In, redirecting');
      this.router.navigate(['./cabinet']);
    }

  }
}
