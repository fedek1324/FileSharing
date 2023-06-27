import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Message } from '../../shared/models/message';
import { User } from '../../shared/models/user';
import { AuthService } from '../../shared/services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  message: Message;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.message = { type: 'success', text: '' };
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit(): void {
    const formData = this.form.value;

    this.userService.getUser(formData.email).toPromise()
    .then((user: User) => {
      if (user) {
        if (user.password === formData.password) {
          this.authService.login(user);
          this.message = {
            text: 'Login success',
            type: 'success',
          };
          setTimeout( () => this.router.navigate(["./cabinet"], {}), 800);
        } else {
          this.message = {
            text: 'Password incorrect',
            type: 'danger',
          };
        }
      } else {
        this.message = {
          text: 'The user doesnt exist',
          type: 'danger',
        };
      }
    })
    .catch(err => {
      console.log("Cached ERR" + err);
    }) 
  }
}
