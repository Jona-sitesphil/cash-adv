import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // <-- Import MatDialog
import { FeaturesService } from './../../features.service';
import { ApproveModalComponent } from '../../../core/approve-modal/approve-modal.component';
import { RejectRequestModalComponent } from '../../../core/reject-request-modal/reject-request-modal.component';
import { PaymentScheduleComponent } from '../../../core/payment-schedule/payment-schedule.component'; // <-- PaymentSchedule

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    ApproveModalComponent,
    RejectRequestModalComponent,
    PaymentScheduleComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  requests: any[] = [];
  dashboardStats: any = {};

  paymentSchedule = [
    { employee: 'Jons', date: 'April 1, 2025', amount: 500 },
    { employee: 'Pogs', date: 'May 1, 2025', amount: 500 },
    { employee: 'Jons', date: 'June 1, 2025', amount: 500 },
    { employee: 'Pogs', date: 'December 1, 2025', amount: 500 },
    { employee: 'Pogs', date: 'May 1, 2025', amount: 500 },
    { employee: 'Pogs', date: 'June 1, 2025', amount: 500 },
  ];

  jonadata: any[] = [
    { label: 'Total Request', count: 7 },
    { label: 'Pending Request', count: 4 },
    { label: 'Approved this Month', count: 3 },
  ];
  isSidebarOpen: boolean = false;

  isApproveModalOpen: boolean = false;
  isRejectModalOpen: boolean = false;
  isViewDetailsModalOpen: boolean = false;
  selectedEmployee: string = '';
  selectedAmount: number = 0;
  selectedPaymentSchedule: any[] = [];
  deductionStartDate: string = '2025-04-01';
  monthlyDeductionAmount: number = 500;
  numberOfInstallments: number = 6;

  selectedNeededDate: string = '';
  selectedReason: string = '';

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog // <-- Inject MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.featuresService.getRequests().subscribe({
      next: (response: any) => {
        // Assuming response.data.cashAdvanceRequests holds the array of requests.
        this.requests = response.data.cashAdvanceRequests;
      },
      error: (err: any) => console.error('Failed to load requests', err),
    });
  }

  openApproveModal(employee: string, amount: number): void {
    this.selectedEmployee = employee;
    this.selectedAmount = amount;
    this.selectedPaymentSchedule = this.paymentSchedule.filter(
      (item) => item.employee === employee
    );
    this.isApproveModalOpen = true;
  }

  closeApproveModal(): void {
    this.isApproveModalOpen = false;
  }

  handleApproval(): void {
    console.log(
      `Approval confirmed for ${this.selectedEmployee} - Amount: ${this.selectedAmount}`
    );
    this.closeApproveModal();
  }

  openRejectModal(employee: string, amount: number): void {
    this.selectedEmployee = employee;
    this.selectedAmount = amount;
    this.isRejectModalOpen = true;
  }

  closeRejectModal(): void {
    this.isRejectModalOpen = false;
  }

  handleRejection(reason: string): void {
    console.log(
      `Request rejected for ${this.selectedEmployee} - Reason: ${reason}`
    );
    this.closeRejectModal();
  }

  openViewDetailsModal(item: any): void {
    this.selectedPaymentSchedule = [item];
    this.selectedEmployee = item.userName;
    this.isViewDetailsModalOpen = true;
  }

  // You can remove these if not needed
  closeViewDetailsModal(): void {
    this.isViewDetailsModalOpen = false;
  }
}
