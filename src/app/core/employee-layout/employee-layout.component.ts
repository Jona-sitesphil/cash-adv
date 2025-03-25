import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { EmployeeHeadComponent } from '../employee-head/employee-head.component';
@Component({
  selector: 'app-employee-layout',
  imports: [ EmployeeHeadComponent],
 
templateUrl: './employee-layout.component.html',
  styleUrl: './employee-layout.component.css'
})
export class EmployeeLayoutComponent {

}
