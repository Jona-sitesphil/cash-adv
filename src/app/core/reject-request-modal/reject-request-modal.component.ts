import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reject-request-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './reject-request-modal.component.html',
  styleUrls: ['./reject-request-modal.component.css'],
})
export class RejectRequestModalComponent {
  @Input() data!: { employee: string; amount: number };
  @Output() modalClosed = new EventEmitter<void>();
  @Output() rejectionConfirmed = new EventEmitter<string>();

  rejectionReason: string = '';

  closeModal(): void {
    this.modalClosed.emit();
  }

  confirmRejection(): void {
    console.log(
      `Rejected ${this.data.employee} - Reason: ${this.rejectionReason}`
    );
    this.rejectionConfirmed.emit(this.rejectionReason);
    this.closeModal();
  }
}
