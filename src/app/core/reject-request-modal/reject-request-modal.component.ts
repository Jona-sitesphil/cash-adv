import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeaturesService } from '../../features/features.service';

@Component({
  selector: 'app-reject-request-modal',
  templateUrl: './reject-request-modal.component.html',
  styleUrls: ['./reject-request-modal.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, FormsModule],
})
export class RejectRequestModalComponent {
  @Input() paymentSchedule: any;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() rejectionConfirmed = new EventEmitter<string>();

  rejectionReason: string = '';

  // Inject FeaturesService using Angular's inject() method (suitable for standalone components)
  private featuresService = inject(FeaturesService);

  closeModal() {
    this.modalClosed.emit();
  }

  confirmRejection() {
    if (this.rejectionReason.trim()) {
      // Call the API via FeaturesService.
      // Here, we assume that the request identifier is in paymentSchedule.id.
      this.featuresService
        .rejectRequest(this.paymentSchedule.id, this.rejectionReason)
        .subscribe({
          next: (response: any) => {
            console.log('Rejection successful:', response);
            this.rejectionConfirmed.emit(this.rejectionReason);
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Rejection failed:', error);
          },
        });
    }
  }
}
