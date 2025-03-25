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
        // Assuming the response includes a property named 'role'
        const userRole = response.role;
        const message = response.message;

        this.zone.run(() => {
          alert("login successful");
          // this.snackbarService.showSuccess('Login successful!');
          if (userRole === 'Admin') {
            this.router.navigate(['/main/dashboard']);
          } else if (userRole === 'Employee') {
            this.router.navigate(['/employee/dashboard']);
          } else {
            // Fallback if role is unrecognized
            this.router.navigate(['/']);
          }
        });
      },
      error: (message) => {
        // this.snackbarService.showError(message);
        alert (message);
      }
    });
  }
}
