import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinetComp/cabinet.component';
import { TitleComponent } from './title/title.component';
import { FilesComponent } from './files/files.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [CabinetComponent, TitleComponent, FilesComponent, FileUploadComponent],
  imports: [
    CommonModule,
    CabinetRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ]
})
export class CabinetModule { }
