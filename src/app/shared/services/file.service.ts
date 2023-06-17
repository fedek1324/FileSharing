import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { MyFile } from '../models/file';
import { asyncDecoratorWithDelay } from '../../shared/services/delays';

@Injectable()
export class FileService {
  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  endpoint = 'http://localhost:3000/files/';

  private postFile(fileToUpload: MyFile): Observable<MyFile> {
    return this.httpClient
      .post(this.endpoint, fileToUpload, this.httpOptions)
      .pipe(
        tap(() => console.log(`finished adding file`)),
        catchError(this.handleError<any>('uploadFile'))
      );
  }

  postFileSafe(fileToUpload: MyFile): Promise<MyFile> {
    return asyncDecoratorWithDelay(this.postFile.bind(this), arguments);
  }


  searchFiles(term: string): Observable<MyFile[]> {
    console.log('fetching files...');
    return this.httpClient
      .get<MyFile[]>(`${this.endpoint}/?name_like=${term}`)
      .pipe(
        tap((_) => console.log('fetched files')),
        catchError(this.handleError<MyFile[]>('fetchFiles', []))
      );
  }

  getFile(id: number): Observable<MyFile> {
    console.log('fetching file...' + id);
    return this.httpClient.get<MyFile>(`${this.endpoint}${id}`).pipe(
      tap((_) => console.log('fetched file ' + id)),
      catchError(this.handleError<MyFile>('fetchFile by id'))
    );
  }
  
  // getFileSafe(id: number): Promise<MyFile>{
  //   return asyncDecoratorWithDelay(this.getFile.bind(this), arguments);
  // }


  private deleteFile(id : number) : Observable<void | object> {
    console.log('in delete function. deleting id:' + id);
    return this.httpClient.delete(`${this.endpoint}${id}`).pipe(
      tap(() => console.log('finished delete')),
      catchError(this.handleError<void>('deleteFileErr'))
      );
    }

  deleteFileSafe(id: number): Promise<MyFile>{
    return asyncDecoratorWithDelay(this.deleteFile.bind(this), arguments);
  }

  downloadFile(file: MyFile) {
        console.log(file.content);
        this.b64toBlob(file.content).then((blob) => {
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.setAttribute('download', file.name);
          document.body.appendChild(downloadLink);
          downloadLink.click();
        });
    return;
  }

  b64toBlob = (base64) => fetch(base64).then((res) => res.blob());


  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      var errMsg : string = error.message;
      console.log(`${operation} failed: ${error.message}`);
      if (errMsg.includes("413 Payload Too Large"))
        console.log('++++++');
      //413 Payload Too Large

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
