import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(function (){ scroll(0,0); }, 1);
  }

}
