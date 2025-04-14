import { NgIf } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturesService } from '../../features/features.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf, FormsModule],
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private featuresService: FeaturesService,
    private router: Router,
    private zone: NgZone
  ) {}

  login() {
    this.featuresService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        const userRole = response.role;
        const token = response.token;

        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('role', userRole);
        }

        this.zone.run(() => {
          alert('Login successful');
          if (userRole === 'Admin') {
            this.router.navigate(['/main/dashboard']);
          } else if (userRole === 'Employee') {
            this.router.navigate(['/employee/dashboard']);
          } else if (userRole === 'Supervisor') {
            this.router.navigate(['/supervisor/dashboard']);
          }
        });
      },
      error: (error) => {
        console.error('❌ Login error:', error);
        this.errorMessage = 'Invalid email or password';
        alert(this.errorMessage);
      },
    });
  }
}
