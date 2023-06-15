import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../shared/services/file.service';
import { MyFile } from '../../shared/models/file';
import { AuthService } from '../../shared/services/authService';
import { UserService } from '../../shared/services/user.service';
import { Message } from 'src/app/shared/models/message';
import { of } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  animations: [
    trigger('fadeOutAnimation', [
      state('visible', style({ opacity: 1 })),
      transition(':leave', [
        animate('1.5s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FileUploadComponent implements OnInit {
  constructor(
    private fileUploadService: FileService,
    private authService: AuthService,
    public userservice: UserService
  ) {}

  form: FormGroup;

  ngOnInit(): void {
    //this.authService.enableGuest();
    this.form = new FormGroup({
      descr: new FormControl(null),
    });
  }

  fileToUpload: File = null;
  message: Message = { type: 'success', text: '' };

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  getBase64(file): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.toString());
      reader.onerror = (error) => reject('error');
    });
  }

  getCurrentDate(): string {
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var date = day + '.' + month + '.' + year;
    return date;
  }

  uploadFileToActivity() {
    var currentDate = new Date();
    var date = ('0' + currentDate.getDate()).slice(-2) + '.' + ('0' + (currentDate.getMonth()+1)).slice(-2) + '.' + currentDate.getFullYear();
    var time = ('0' + currentDate.getHours()).slice(-2) + ':' + ('0' + currentDate.getMinutes()).slice(-2);
    console.log(this.fileToUpload);
    if (this.fileToUpload.size > 8 * 1024 * 1024) { // 8 MB
      this.showMessage('danger', 'File too large, sorry(');
      return;
    }
    this.getBase64(this.fileToUpload).then((fileStr) => {
      var myFile: MyFile = {
        id: 0,
        name: this.fileToUpload.name,
        description: this.form.value.descr,
        uploadDate: date,
        uploadTime: time,
        content: fileStr,
      };
      this.fileUploadService.postFile(myFile).subscribe((data) => {
        if (!data) {
          console.log('no data');
          this.showMessage('danger', 'Cannot upload file, server did not respond');
          return;
        }
        // add id of currently uploaded file to user inforamtion
        var user = this.authService.getAuthUser();
        if (user.files == undefined) user.files = [];
        user.files.push(data.id);
        this.userservice.deleteUser(user).subscribe((res) => {
          this.userservice.updateUser(user).subscribe((res) => {
            console.log(res);
            // as response we get user with correct id (not 0) and we have to login true user
            this.authService.login(res);
            // location.reload();
            this.userservice.files.push(myFile)
            this.userservice.outFiles$ = of(this.userservice.files);
            this.userservice.onFilesChange();
          });
        });
      });
    });
    return;
  }

  showMessage(type, text) {
    this.message = { type: type, text: text };
    setTimeout( () => this.message = null, 5000);
  }
}
