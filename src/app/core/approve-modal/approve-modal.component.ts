import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { FeaturesService } from '../../features/features.service';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrls: ['./approve-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ApproveModalComponent implements OnChanges {
  @Input() showModal = false;
  @Input() paymentSchedule: any = {};
  @Output() modalClosed = new EventEmitter<void>();
  @Output() approvalConfirmed = new EventEmitter<void>();

  deductionStartDate: string = '';
  monthlyDeductionAmount: number = 0;
  numberOfInstallments: number = 0;

  // Use inject() to get the service instance
  private featuresService = inject(FeaturesService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentSchedule'] && this.paymentSchedule) {
      this.numberOfInstallments = this.paymentSchedule.monthsToPay || 0;
      this.monthlyDeductionAmount = this.paymentSchedule.amount
        ? this.paymentSchedule.amount / (this.paymentSchedule.monthsToPay || 1)
        : 0;

      // Set deduction start date to neededDate (if exists)
      this.deductionStartDate = this.paymentSchedule.neededDate
        ? new Date(this.paymentSchedule.neededDate).toISOString().split('T')[0]
        : '';
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }

  confirmApproval() {
    if (!this.paymentSchedule?.id) {
      console.error('No request ID specified for approval.');
      return;
    }

    const approvalData = {
      deductionStartDate: this.deductionStartDate,
      numberOfInstallments: this.numberOfInstallments,
      monthlyDeductionAmount: this.monthlyDeductionAmount,
    };

    this.featuresService.approveRequest(this.paymentSchedule.id, {}).subscribe({
      next: (response: any) => {
        console.log('Approval successful:', response);
        this.approvalConfirmed.emit();
        this.closeModal();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Approval failed:', error.message);
      },
    });
  }
}
