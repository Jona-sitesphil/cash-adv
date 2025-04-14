import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { FeaturesService } from './../../features/features.service';

@Component({
  selector: 'app-supervisor-head',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
  ],
  templateUrl: './supervisor-head.component.html',
  styleUrl: './supervisor-head.component.css',
})
export class SupervisorHeadComponent {
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }
  toggleSidenav() {}
  constructor(private featuresService: FeaturesService) {}
  onLogout() {
    this.featuresService.handleLogout();
  }
}
