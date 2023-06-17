import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/authService';
import { FileService } from 'src/app/shared/services/file.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MyFile } from '../../shared/models/file';
import { tap } from 'rxjs/operators';

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

  public hasLoadedFiles$ = false;

  search(term: string): void {
    var filteredFiles = this.userService.files.filter((file) =>
      file.name.includes(term)
    );
    this.userService.outFiles$ = of(filteredFiles);
    console.log(this.userService.files)
  }

  ngOnInit(): void {
    this.nameAsc = true;
    this.nameDesc = false;
    this.timeAsc = false;
    this.timeDesc = false;
    this.sizeAsc = false;
    this.sizeDesc = false;
    this.initFilesList();

    this.userService.addOnFilesChangeHangler(() => this.initFilesList());
  }

  initFilesList() {
    this.hasLoadedFiles$ = false;
    this.userService.hasFiles = false;
    this.userService.files = []; // otherwise doubles file instances
    var userFilesIds = this.authService.getAuthUser().files;
    console.log('file Ids from authService:' + userFilesIds);
    if (userFilesIds) {
      if (userFilesIds.length > 0) this.userService.hasFiles = true;
      userFilesIds.forEach((fileId) => {
        this.fileService.getFile(fileId).subscribe((file) => {
          if (file) {
            this.userService.files.push(file);
            this.hasLoadedFiles$ = true;

            // to do fix sort on each file
            let currSort = this.getCurrentSort();
            // console.log(currSort);
            this.sortFiles(currSort.sortBy, currSort.sortOrder)
            this.userService.outFiles$ = of(this.userService.files);
          }
        });
      });
    }

  }

  async deleteFile(id: number) {
    var newUser = this.authService.getAuthUser();
    newUser.files = newUser.files.filter((fileId) => fileId != id);

    this.userService.deleteUserSafe(newUser).then(res => {
      this.userService.addUserSafe(newUser).then(res => {
        console.log(res);
        // as response we get user with correct id (not 0) and we have to login true user
        this.authService.login(res);

        console.log('deleting file id:' + id);
        this.fileService.deleteFileSafe(id).then(() => {
          this.userService.files = this.userService.files.filter(
            (file) => file.id != id
          );
          this.userService.outFiles$ = of(this.userService.files);
          this.userService.onFilesChange();
        });
      });
    });
  }

  download(file: MyFile): void {
    console.log(file);
    this.fileService.downloadFile(file);
  }

  nameAsc : boolean;
  nameDesc : boolean;
  timeAsc : boolean;
  timeDesc : boolean;
  sizeAsc : boolean;
  sizeDesc : boolean;

  getCurrentSort(): { sortBy: SortBy; sortOrder: SortOrder } {
    let sortBy: SortBy | null = null;
    let sortOrder: SortOrder | null = null;

    if (this.nameAsc || this.nameDesc) {
      sortBy = SortBy.Name;
      sortOrder = this.nameAsc ? SortOrder.Ascending : SortOrder.Descending;
    } else if (this.timeAsc || this.timeDesc) {
      sortBy = SortBy.Time;
      sortOrder = this.timeAsc ? SortOrder.Ascending : SortOrder.Descending;
    } else if (this.sizeAsc || this.sizeDesc) {
      sortBy = SortBy.Size;
      sortOrder = this.sizeAsc ? SortOrder.Ascending : SortOrder.Descending;
    }

    return { sortBy, sortOrder };
  }


  sortFiles(sortBy: SortBy, sortOrder: SortOrder): void {
    this.nameAsc = false;
    this.nameDesc = false;
    this.timeAsc = false;
    this.timeDesc = false;
    this.sizeAsc = false;
    this.sizeDesc = false;
  
    switch (sortBy) {
      case SortBy.Name:
        this.nameAsc = sortOrder === SortOrder.Ascending;
        this.nameDesc = sortOrder === SortOrder.Descending;
        this.userService.files.sort((fileA, fileB) =>
          sortOrder === SortOrder.Ascending
            ? fileA.name.localeCompare(fileB.name)
            : fileB.name.localeCompare(fileA.name)
        );
        break;
  
      case SortBy.Time:
        this.timeAsc = sortOrder === SortOrder.Ascending;
        this.timeDesc = sortOrder === SortOrder.Descending;
        this.userService.files.sort((fileA, fileB) => {
          const compareStrA: string = fileA.uploadDate + ' ' + fileA.uploadTime;
          const compareStrB: string = fileB.uploadDate + ' ' + fileB.uploadTime;
          if (sortOrder === SortOrder.Ascending) {
            return compareStrA.localeCompare(compareStrB);
          } else {
            return compareStrB.localeCompare(compareStrA);
          }
        });
        break;
  
      case SortBy.Size:
        this.sizeAsc = sortOrder === SortOrder.Ascending;
        this.sizeDesc = sortOrder === SortOrder.Descending;
        this.userService.files.sort((fileA, fileB) =>
          sortOrder === SortOrder.Ascending
            ? fileA.content.length - fileB.content.length
            : fileB.content.length - fileA.content.length
        );
        break;
    }
  
    // console.log(this.userService.files);
    // console.log("called SORT, now sort is", this.getCurrentSort());
    // console.log("variables ", this.nameAsc ,
    // this.nameDesc ,
    // this.timeAsc ,
    // this.timeDesc ,
    // this.sizeAsc ,
    // this.sizeDesc)
    this.userService.outFiles$ = of(this.userService.files); // if i remove it i get doubled files
  }
  
  nameOnClick() {
    const sortOrder = this.nameAsc ? SortOrder.Descending : SortOrder.Ascending;
    this.sortFiles(SortBy.Name, sortOrder);
  }
  
  timeOnClick() {
    const sortOrder = this.timeAsc ? SortOrder.Descending : SortOrder.Ascending;
    this.sortFiles(SortBy.Time, sortOrder);
  }
  
  sizeOnClick() {
    const sortOrder = this.sizeAsc ? SortOrder.Descending : SortOrder.Ascending;
    this.sortFiles(SortBy.Size, sortOrder);
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

enum SortBy {
  Name = 'name',
  Time = 'time',
  Size = 'size',
}

enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}