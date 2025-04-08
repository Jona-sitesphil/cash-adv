import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FeaturesService } from '../features/features.service';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './editusermodal.component.html',
  styleUrls: ['./editusermodal.component.css'],
})
export class EditUserModalComponent implements OnInit {
  @Input() user!: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<any>();

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService
  ) {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.userForm.patchValue({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        phone: this.user.phone,
      });
    }
  } 

  close() {
    this.closeModal.emit();
  }

  updateUser() {
    if (this.userForm.invalid) return;
    const payload = this.userForm.value;
    this.featuresService.updateUser(payload.id, payload).subscribe({
      next: () => {
        this.userUpdated.emit(payload);
        this.close();
        // *** force full-page refresh ***
        window.location.reload();
      },
      error: (err) => console.error('Failed to update user:', err),
    });
  }
}
