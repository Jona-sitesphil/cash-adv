import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { FeaturesService } from './../../features/features.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.css'],
  imports: [FormsModule, MatIcon, CommonModule],
})
export class EmployeeModalComponent {
  // Initial form field values
  amount: number = 0;
  reason: string = '';
  neededDate: string = '';
  monthsToPay: number = 0;
  paymentDates: string[] = [];

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() submitRequestEvent = new EventEmitter<any>();

  isSidebarOpen: boolean = false;
  showEmployeeModal: boolean = false;

  constructor(private featuresService: FeaturesService) {}

  // Close the modal and emit the close event
  closeModal(): void {
    this.closeModalEvent.emit();
  }

  // Handle the changes to monthsToPay and dynamically create the payment dates
  updatePaymentDates(value: number): void {
    this.monthsToPay = value;

    // Reset payment dates whenever the monthsToPay changes
    this.paymentDates = [];
    if (value > 0 && this.neededDate) {
      let currentDate = new Date(this.neededDate);
      for (let i = 0; i < value; i++) {
        currentDate.setMonth(currentDate.getMonth() + 1); // Increment by 1 month
        this.paymentDates.push(currentDate.toISOString().split('T')[0]); // Push the new date in YYYY-MM-DD format
      }
    }
  }

  // Update a specific payment date in the paymentDates array
  updatePaymentDate(index: number, value: string): void {
    this.paymentDates[index] = value;
  }

  // Submit the cash advance request and handle the response
  submitRequest(): void {
    if (this.amount < 500) {
      alert('Amount should be at least ₱500');
      return;
    }

    const newRequest = {
      reason: this.reason,
      amount: this.amount,
      neededDate: this.neededDate,
      monthsTopay: this.monthsToPay,
      paymentDates: this.paymentDates,
    };

    this.featuresService.createRequest(newRequest).subscribe({
      next: (response) => {
        if (response.status === 'FAILED') {
          alert(
            `Request submission failed: ${
              response.message || 'Please try again.'
            }`
          );
        } else {
          // Emit an object containing both the refresh flag and newRequest data.
          this.submitRequestEvent.emit({ refresh: true, newRequest: response });
          alert('Request submitted successfully');
          this.closeModal(); // Close the modal after submitting the request
        }
      },
      error: (error) => {
        console.error('Error submitting request:', error);
        alert('An error occurred while submitting the request.');
      },
    });
  }

  // These are placeholder methods you had, add proper implementations based on your use case
  openViewDetailsModal(arg0: any) {
    throw new Error('Method not implemented.');
  }
  openRejectModal(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }
  openApproveModal(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }

  handleNewRequest($event: any) {
    throw new Error('Method not implemented.');
  }
}
