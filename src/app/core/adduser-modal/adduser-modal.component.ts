import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FeaturesService } from './../../features/features.service';

export function confirmPasswordValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ mismatch: true });
  } else {
    return null;
  }
  return null;
}

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  templateUrl: './adduser-modal.component.html',
  styleUrls: ['./adduser-modal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatError,
  ],
})
export class AddUserModalComponent {
  onPhoneInput($event: Event) {
    throw new Error('Method not implemented.');
  }
  userForm: FormGroup;

  @Output() closeModal = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService
  ) {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
            ),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
        role: ['', Validators.required],
      },
      { validators: confirmPasswordValidator } // Custom validator for confirming password
    );
  }

  close(): void {
    this.closeModal.emit();
  }

  addUser(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      // Convert phone number to a string
      userData.phone = userData.phone.toString();

      this.featuresService.createUser(userData).subscribe({
        next: (response) => {
          console.log('User added successfully', response);
          this.userAdded.emit(response);
          this.close();
        },
        error: (error) => {
          console.error('Error adding user', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
