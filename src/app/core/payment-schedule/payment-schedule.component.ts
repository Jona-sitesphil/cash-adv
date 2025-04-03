import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FeaturesService } from './../../features/features.service';
import { ViewReceiptComponent } from '../view-receipt/view-receipt.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule, // Required for opening dialogs
  ],
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css'],
})
export class PaymentScheduleComponent implements OnChanges {
  @Input() paymentSchedule: any = {};
  @Input() employeeName: string = '';
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() receiptUploadSuccess = new EventEmitter<void>(); // Emit success event

  data: any;

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog,
    private http: HttpClient // Inject HttpClient for API calls
  ) {}

  // Dropdown options for status
  statusOptions: { value: number; label: string }[] = [
    { value: 3, label: 'Paid' },
    { value: 2, label: 'Unpaid' },
  ];

  // Convert backend string values to numeric values
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['paymentSchedule'] &&
      this.paymentSchedule &&
      this.paymentSchedule.paymentSchedule
    ) {
      this.paymentSchedule.paymentSchedule.forEach((payment: any) => {
        if (payment.paymentStatus === 'Paid') {
          payment.paymentStatus = 3;
        } else if (payment.paymentStatus === 'Unpaid') {
          payment.paymentStatus = 2;
        }
      });
    }
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  trackById(index: number, payment: any): number {
    return payment.id;
  }

  updatePaymentStatus(payment: any): void {
    if (!payment.id) {
      console.error('Payment ID is missing.');
      return;
    }

    this.featuresService
      .updatePaymentStatus(payment.id, payment.paymentStatus)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'FAILED') {
            alert(`Failed to update payment status. ${response.message}`);
          } else {
            console.log(`Payment status updated to ${payment.paymentStatus}`);
            alert('Payment status updated successfully!');
          }
        },
        error: (err) => console.error('Error updating payment status:', err),
      });
  }

  // File selection event handler
  onFileSelected(event: Event, payment: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      payment.selectedFile = input.files[0];
      payment.selectedFileName = payment.selectedFile.name;
    }
  }

  // Upload receipt to backend
  uploadReceipt(payment: any): void {
    if (!payment.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    if (!payment.id) {
      alert('Missing payment ID.');
      return;
    }

    console.log('Uploading receipt for Payment ID:', payment.id);

    const formData = new FormData();
    formData.append('receiptImage', payment.selectedFile);

    // Retrieve the auth token from sessionStorage
    const authToken = sessionStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${authToken}` };

    this.http
      .put(
        `http://10.0.0.9:5249/api/CashAdvanceRequest/Upload-Receipt/${payment.id}`,
        formData,
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 'FAILED') {
            alert(`Upload failed. `);
          } else {
            alert(`Receipt uploaded successfully!`);
            payment.selectedFile = null;
            payment.selectedFileName = '';

            // Emit success event after upload
            this.receiptUploadSuccess.emit();
          }
        },
        error: (error) => {
          console.error('Upload failed:', error);
          alert('Failed to upload receipt. Please try again.');

          // Emit success event after upload
          this.receiptUploadSuccess.emit();
        },
      });
  }

  // Open receipt in modal
  openReceiptModal(imageFilePath: string): void {
    this.featuresService.getUploadedReceipt(imageFilePath).subscribe({
      next: (receiptUrl) => {
        this.dialog.open(ViewReceiptComponent, {
          data: { receiptUrl },
          width: '600px',
        });
      },
      error: (err) => {
        console.error('Error retrieving receipt:', err);
        alert('Error retrieving receipt');
      },
    });
  }
}
