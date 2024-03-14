import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hr-home',
  templateUrl: './hr-home.component.html',
  styleUrls: ['./hr-home.component.css']
})
export class HrHomeComponent implements OnInit{
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
 
}
