import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from '../models/user';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable()
export class UserService{
  constructor(private http: HttpClient) {
  }

  endpoint = 'http://localhost:3000/users';

  getUser(email: string): Observable<User> {
    return this.http.get(`${this.endpoint}?email=${email}`)
      .pipe(map((user: User[]) => user[0] ? user[0] : undefined));
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  updateUser(user : User): Observable<User> {
    console.log('updatin user');
    console.log('new user:');
    console.log(user);
    return this.http.put(`${this.endpoint}/${user.id}`, user, this.httpOptions).pipe(
      tap(() => console.log(`finished updating user`)),
      catchError(this.handleError<any>('updated user'))
    )
  }

  addUser(user:User) : Observable<User> {
    return this.http.post(this.endpoint, user, this.httpOptions).pipe(
      tap(() => console.log(`finished adding user`)),
      catchError(this.handleError<any>('add user'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
