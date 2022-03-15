import { User } from '../models/user';

export class AuthService{

    private isAuthentificated = false;
  
    login(user : User){
      localStorage.setItem('user', JSON.stringify(user));
      this.isAuthentificated = true;
    }

    getAuthUser() : User {
      return JSON.parse(localStorage.getItem('user'));
    }

    enableGuest() {
      this.login({id: 777, email: "guest", password : "guest"});
    }
  
    logout(){
      this.isAuthentificated = false;
      localStorage.clear();
    }
  
    isLoggedIn(): boolean{
      return JSON.parse(localStorage.getItem('user'));
    }
  }
  