import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';
import { Message } from '../../shared/models/message';
import { AuthService } from '../../shared/services/authService';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
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
      passwordAgain: new FormControl(null, [Validators.required]),
    });
  }

  passAgainChanged() {
    if (this.form.value.password != this.form.value.passwordAgain)
      this.form.controls.passwordAgain.setErrors({ matchesPassword: true });
  }

  onSubmit(): void {
    const formData = this.form.value;

    var user: User = {
      id: 0,
      email: formData.email,
      password: formData.password,
    }; // id - 0 = auto id

    // if (this.userService.getUser("ewfe@yt"))
    var isExists = false;
    this.userService.getUser(formData.email).toPromise()
    .then ((data) => {
      if(data) {
        this.message = {type: 'danger', 'text' : 'This user is already exists'};
        return;
      }
      else {
        this.userService.addUserSafe(user).then(res => {
          console.log(res);
          // as response we get user with correct id (not 0) and we have to login true user
          this.authService.login(res);
          this.message = { type: 'success', text: 'Registration successful' };
          setTimeout(() => this.router.navigate(['./cabinet'], {}), 800);
        });
      }
    })
    .catch( err => {
      this.message = {
        text: 'DB Server error',
        type: 'danger',
      };
      console.log("getting error on registation see below")
      console.log(err);
    })
  }
}
