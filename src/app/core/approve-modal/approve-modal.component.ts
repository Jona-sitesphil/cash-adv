import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ApproveModalComponent {
  @Input() showModal = false;
  @Input() employeeName: string = '';
  @Input() amountRequested: number = 0;
  @Input() deductionStartDate: string = '';
  @Input() monthlyDeductionAmount: number = 0;
  @Input() numberOfInstallments: number = 0;
  @Input() paymentSchedule: any[] = [];

  @Output() modalClosed = new EventEmitter<void>();
  @Output() approvalConfirmed = new EventEmitter<void>();
item: any;

  get remainingInstallments(): number {
    return this.numberOfInstallments - this.paymentSchedule.length;
  }
  mockdata: any[] = [
    { employee: 'Jons', request_date: '01/20/2025', date_needed: '01/25/2025', amount: 1500, purpose: 'Bills' },
    { employee: 'Pogs', request_date: '02/20/2025', date_needed: '02/25/2025', amount: 1500, purpose: 'Bills' },
  ];

  closeModal() {
    this.modalClosed.emit();
  }

  confirmApproval() {
    this.approvalConfirmed.emit();
    this.closeModal();
  }
}
