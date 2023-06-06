import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
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
    public userService: UserService
  ) {}

  search(term: string): void {
    var filteredFiles = this.userService.files.filter((file) =>
      file.name.includes(term)
    );
    this.userService.outFiles$ = of(filteredFiles);
    console.log(this.userService.files)
  }

  ngOnInit(): void {
    this.userService.files = []; // otherwise doubles file instances
    var userFilesIds = this.authService.getAuthUser().files;
    console.log('file Ids from authService:' + userFilesIds);
    if (userFilesIds) {
      if (userFilesIds.length > 0) this.userService.hasFiles = true;
      userFilesIds.forEach((fileId) => {
        this.fileService.getFile(fileId).subscribe((file) => {
          this.userService.files.push(file);
        });
      });
    }
    this.userService.outFiles$ = of(this.userService.files);
  }

  deleteFile(id: number) {
    var newUser = this.authService.getAuthUser();
    newUser.files = newUser.files.filter((fileId) => fileId != id);

    this.userService.deleteUser(newUser).subscribe((res) => {
      this.userService.updateUser(newUser).subscribe((res) => {
        console.log(res);
        // as response we get user with correct id (not 0) and we have to login true user
        this.authService.login(res);
        console.log('deleting file id:' + id);
        this.fileService.deleteFile(id).subscribe(() => {
          this.userService.files = this.userService.files.filter(
            (file) => file.id != id
          );
          this.userService.outFiles$ = of(this.userService.files);
        });
      });
    });
  }

  nameAsc = false;
  nameDesc = false;
  timeAsc = false;
  timeDesc = false;
  sizeAsc = false;
  sizeDesc = false;

  download(file: MyFile): void {
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
      this.userService.files.sort((fileA, fileB) =>
        fileA.name.localeCompare(fileB.name)
      );
    else
      this.userService.files.sort((fileA, fileB) =>
        fileB.name.localeCompare(fileA.name)
      );
    console.log(this.userService.files);
    this.userService.outFiles$ = of(this.userService.files);
  }

  timeOnClick() {
    this.nameAsc = false;
    this.nameDesc = false;
    this.sizeAsc = false;
    this.sizeDesc = false;
    this.timeAsc = !this.timeAsc;
    this.timeDesc = !this.timeAsc;
    this.userService.files.sort((fileA, fileB) => {
      var compareStrA: string = fileA.uploadDate + ' ' + fileA.uploadTime;
      var compareStrB: string = fileB.uploadDate + ' ' + fileB.uploadTime;
      if (this.timeAsc) return compareStrA.localeCompare(compareStrB);
      else return compareStrB.localeCompare(compareStrA);
    });
    console.log(this.userService.files);
    this.userService.outFiles$ = of(this.userService.files);
  }

  sizeOnClick() {
    this.nameAsc = false;
    this.nameDesc = false;
    this.timeAsc = false;
    this.timeDesc = false;
    this.sizeAsc = !this.sizeAsc;
    this.sizeDesc = !this.sizeAsc;
    if (this.sizeAsc)
      this.userService.files.sort(
        (fileA, fileB) => fileA.content.length - fileB.content.length
      );
    else
      this.userService.files.sort(
        (fileA, fileB) => fileB.content.length - fileA.content.length
      );
    this.userService.outFiles$ = of(this.userService.files);
  }

  getSizeFromBase64StringLength(stringLen: number): string {
    var size: number = parseInt((stringLen / 1372).toFixed(1)); // KB
    if (size > 1024) {
      return (size / 1024).toFixed(1) + ' MB';
    } else {
      return size + ' KB';
    }
  }
}
