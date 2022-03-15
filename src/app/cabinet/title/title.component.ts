import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/authService';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnInit {
  constructor(private authService: AuthService,
              private router : Router) {}

  userName = 'guest';

  ngOnInit(): void {
    this.userName = this.authService.getAuthUser().email;
  }

  logOut() : void {
    this.authService.logout();
    this.router.navigate(['./landing']);
  }
}
