import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/authService';
import { FileService } from 'src/app/shared/services/file.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MyFile } from '../../shared/models/file';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
})
export class FilesComponent implements OnInit {
  constructor(
    private fileService: FileService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  search(term: string): void {
    var filteredFiles = this.files.filter( file => file.name.includes(term));
    this.outFiles$ = of(filteredFiles);
  }

  outFiles$: Observable<MyFile[]>;
  files: MyFile[] = [];
  hasFiles = false;

  ngOnInit(): void {
    var userFilesIds = this.authService.getAuthUser().files;
    console.log("file Ids from authService:" + userFilesIds);
    if (userFilesIds) {
      if (userFilesIds.length > 0)
        this.hasFiles = true;
      userFilesIds.forEach((fileId) => {
        this.fileService.getFile(fileId).subscribe((file) => {
          console.log("Got file", file);
          if (file) {
            this.files.push(file);
          }
        });
      });
    }
    this.outFiles$ = of(this.files);
  }

  deleteFile(id: number) {
    var newUser =  this.authService.getAuthUser();
    newUser.files = newUser.files.filter( fileId => fileId !=id);
    this.userService.deleteUser(newUser).subscribe();

    newUser.id = 0;
    this.userService.addUser(newUser).subscribe();
    this.authService.login(newUser);

    console.log('deleting file id:' + id);
    this.fileService.deleteFile(id).subscribe(() => location.reload());
  }

  nameAsc = false;
  nameDesc = false;
  timeAsc = false;
  timeDesc = false;
  sizeAsc = false;
  sizeDesc = false;

  download(file : MyFile) : void {
    console.log(file);
    this.fileService.downloadFile(file);
  }

  nameOnClick() {
    this.timeAsc = false;
    this.timeDesc = false;
    this.sizeAsc = false;
    this.sizeDesc = false;
    this.nameAsc = !this.nameAsc;
    this.nameDesc = !this.nameAsc;
    console.log('this.nameAsc = ' + this.nameAsc);
    console.log('this.nameDesc = ' + this.nameDesc);
    if (this.nameDesc)
      this.files.sort( (fileA, fileB) => fileA.name.localeCompare(fileB.name))
    else 
      this.files.sort( (fileA, fileB) => fileB.name.localeCompare(fileA.name))
    console.log(this.files);
    this.outFiles$ = of(this.files);
  }

  timeOnClick() {
    this.nameAsc = false;
    this.nameDesc = false;
    this.sizeAsc = false;
    this.sizeDesc = false;
    this.timeAsc = !this.timeAsc;
    this.timeDesc = !this.timeAsc;
    this.files.sort( (fileA, fileB) => {
      var compareStrA : string = fileA.uploadDate + " "+ fileA.uploadTime;
      var compareStrB : string = fileB.uploadDate  + " " + fileB.uploadTime;
      if (this.timeAsc)
        return compareStrA.localeCompare(compareStrB);
      else
        return compareStrB.localeCompare(compareStrA);
      });
    console.log(this.files);
    this.outFiles$ = of(this.files);
  }

  sizeOnClick() {
    this.nameAsc = false;
    this.nameDesc = false;
    this.timeAsc = false;
    this.timeDesc = false;
    this.sizeAsc = !this.sizeAsc;
    this.sizeDesc = !this.sizeAsc;
    if (this.sizeAsc)
      this.files.sort( (fileA, fileB) => fileA.content.length  - fileB.content.length)
    else 
      this.files.sort( (fileA, fileB) => fileB.content.length  - fileA.content.length)
    this.outFiles$ = of(this.files);
  }

  getSizeFromBase64StringLength(stringLen : number) : string {
    var size : number = parseInt( (stringLen / 1372).toFixed(1)); // KB
    if (size > 1024) {
      return (size / 1024).toFixed(1) + " MB";
    }
    else {
      return size + " KB";
    }
  }
}
