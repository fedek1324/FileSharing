import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from '../models/user';
import {catchError, map, tap} from 'rxjs/operators';
import { MyFile } from '../models/file';
import { asyncDecoratorWithDelay } from '../services/delays';

@Injectable()
export class UserService{
  constructor(private http: HttpClient) {
  }

  public outFiles$: Observable<MyFile[]>;
  public files: MyFile[] = [];
  public hasFiles = false;
  private filesChangeHandlers = [];


  public addOnFilesChangeHangler(func) {
    this.filesChangeHandlers.push(func)
  }

  public onFilesChange() {
    this.filesChangeHandlers.forEach(handler => {
      handler.apply(this, arguments);
    });
  }

  endpoint = 'http://localhost:3000/users';

  getUser(email: string): Observable<User> {
    return this.http.get(`${this.endpoint}?email=${email}`)
      .pipe(
        catchError(this.handleError<any>('GET user')),
        // map changes result so it returns undefined instead of
        // [] if no user
        map((user: User[]) => user[0] ? user[0] : undefined));
  }

  httpOptions : Object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    // responseType: "json"
  };

  // updateUser(user : User): Observable<User> {
  //   console.log('updatin user');
  //   console.log('new user:');
  //   console.log(user);
  //   return this.http.post(`${this.endpoint}`, user, this.httpOptions).pipe( // put doesnt work right
  //     tap(() => console.log(`finished updating user`)),
  //     catchError(this.handleError<any>('updated user'))
  //   )
  // }

  private deleteUser(user : User) : Observable<any> {
    console.log('deleting user', user);
    return this.http.delete(`${this.endpoint}/${user.id}`, this.httpOptions).pipe(
      tap(() => console.log(`finished deleting user`)),
      catchError(this.handleError<any>('deleted user'))
    )
  }

  deleteUserSafe(user : User) : Promise<any> {
    let func = this.deleteUser.bind(this);
    return asyncDecoratorWithDelay(func, arguments);
  }
  
  private addUser(user:User) : Observable<any> {
    return this.http.post(this.endpoint, user, this.httpOptions).pipe(
      tap(() => console.log(`finished adding user`)),
      // catchError(this.handleError<any>('add user'))
      catchError(this.handleError<any>('addUser err'))
      )
    }

  addUserSafe(user : User) : Promise<any> {
    let func = this.addUser.bind(this);
    return asyncDecoratorWithDelay(func, arguments);
  }
    


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      
      throw error;
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
