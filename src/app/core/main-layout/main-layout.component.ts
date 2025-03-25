import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ApproveModalComponent } from '../approve-modal/approve-modal.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
