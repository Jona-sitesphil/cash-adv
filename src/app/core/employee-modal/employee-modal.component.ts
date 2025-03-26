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
  openViewDetailsModal(arg0: any) {
    throw new Error('Method not implemented.');
  }
  openRejectModal(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }
  openApproveModal(arg0: any, arg1: any) {
    throw new Error('Method not implemented.');
  }
  mockdata: any;
  handleNewRequest($event: any) {
    throw new Error('Method not implemented.');
  }
  amount: number = 0;
  reason: string = '';
  neededDate: string = '';
  monthsToPay: number = 0;
  paymentDates: string[] = [];

  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() submitRequestEvent = new EventEmitter<any>();
  isSidebarOpen: any;
  showEmployeeModal: any;

  constructor(private featuresService: FeaturesService) {}

  closeModal(): void {
    this.closeModalEvent.emit();
  }
  // Update the paymentDates array based on the monthsToPay value.
  updatePaymentDates(value: number): void {
    this.monthsToPay = value;
    // Re-create the array with empty strings for each month.
    this.paymentDates = Array(value).fill('');
  }

  // Update a specific payment date in the array.
  updatePaymentDate(index: number, value: string): void {
    this.paymentDates[index] = value;
  }

  submitRequest(): void {
    const newRequest = {
      reason: this.reason,
      amount: this.amount,
      neededDate: this.neededDate,
      monthsTopay: this.monthsToPay,
      paymentDates: this.paymentDates,
    };

    this.featuresService.createRequest(newRequest).subscribe({
      next: (response) => {
        // Emit an object containing both the refresh flag and newRequest data.
        this.submitRequestEvent.emit({ refresh: true, newRequest: response });
        alert(' Adding successful');

        this.closeModal();
      },
      error: (error) => {
        console.error('Error submitting request:', error);
      },
    });
  }
}
