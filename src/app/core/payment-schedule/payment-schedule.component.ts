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

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule  // Add MatDialogModule here
  ],
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css'],
})
export class PaymentScheduleComponent implements OnChanges {
  @Input() paymentSchedule: any = {};
  @Input() employeeName: string = '';
  @Output() closeModalEvent = new EventEmitter<void>();

  // Define the dropdown options with numeric values
  statusOptions: { value: number; label: string }[] = [
    { value: 3, label: 'Paid' },
    { value: 2, label: 'Unpaid' },
  ];

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog  // Inject MatDialog
  ) {}

  // Map backend string values to the corresponding numeric values
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

    this.featuresService.updatePaymentStatus(payment.id, payment.paymentStatus)
      .subscribe({
        next: () => {
          console.log(`Payment status updated to ${payment.paymentStatus}`);
          alert('Payment is Edited');
        },
        error: (err) => console.error('Error updating payment status:', err),
      });
  }

  // Use the imageFilePath instead of the payment ID.
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
