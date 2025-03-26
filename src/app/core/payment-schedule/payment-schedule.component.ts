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
import { FeaturesService } from './../../features/features.service';

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [MatTableModule, MatCardModule, CommonModule, FormsModule],
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

  constructor(private featuresService: FeaturesService) {}

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

    this.featuresService
      .updatePaymentStatus(payment.id, payment.paymentStatus)
      .subscribe({
        next: () => {
          console.log(`Payment status updated to ${payment.paymentStatus}`);
          alert('Payment is Edited');
        },
        error: (err) => console.error('Error updating payment status:', err),
      });
  }
}
