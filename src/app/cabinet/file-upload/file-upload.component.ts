import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../shared/services/file.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyFile } from '../../shared/models/file';
import { AuthService } from '../../shared/services/authService';
import { UserService } from '../../shared/services/user.service';
import { Message } from 'src/app/shared/models/message';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  constructor(
    private fileUploadService: FileService,
    private authService: AuthService,
    private userservice: UserService
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
    var date = this.getCurrentDate();
    var time = new Date().getHours() + ':' + new Date().getMinutes();
    console.log(this.fileToUpload);
    if (this.fileToUpload.size > 8 * 1024 * 1024) {
      this.message = { type: 'danger', text: 'File too large, sorry(' };
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
          this.message = { type: 'danger', text: 'File too large, sorry(' };
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
            location.reload();
          });
        });
      });
    });
    return;
  }
}
