import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FeaturesService } from './../../features.service';
import { ApproveModalComponent } from '../../../core/approve-modal/approve-modal.component';
import { RejectRequestModalComponent } from '../../../core/reject-request-modal/reject-request-modal.component';
import { PaymentScheduleComponent } from '../../../core/payment-schedule/payment-schedule.component';

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
    PaymentScheduleComponent,
    RejectRequestModalComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  requests: any[] = [];
  totalCount: number = 0; // Total number of records returned from API
  totalPagesValue: number = 0; // Total pages from API
  dashboardStats: any = {};

  jonadata: any[] = [
    { label: 'Total Request', count: 7 },
    { label: 'Pending Request', count: 4 },
    { label: 'Approved this Month', count: 3 },
  ];
  isSidebarOpen: boolean = false;

  isApproveModalOpen: boolean = false;
  isRejectModalOpen: boolean = false;
  isViewDetailsModalOpen: boolean = false;
  selectedPaymentSchedule: any = {};

  // Pagination settings
  pageIndex: number = 0; // Local 0-based page index
  pageSize: number = 10; // 10 rows per page

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // Loads the paginated requests from the backend.
  // The API is expected to use 1-based page numbering.
  loadRequests(page: number = this.pageIndex): void {
    // Call the API with (pageIndex + 1) because the API expects 1-based pages.
    this.featuresService
      .getRequestsPaginated(page + 1, this.pageSize)
      .subscribe({
        next: (response: any) => {
          // Assuming the API returns:
          //   data.cashAdvanceRequests: the items on the current page,
          //   data.totalRecords: total number of records,
          //   data.totalPages: total pages,
          //   data.currentPage: the current page (1-based)
          this.requests = response.data.cashAdvanceRequests;
          this.totalCount = response.data.totalRecords;
          this.totalPagesValue = response.data.totalPages;
          this.pageIndex = response.data.currentPage - 1;
        },
        error: (err: any) => console.error('Failed to load requests', err),
      });
  }

  // Returns the total number of pages.
  totalPages(): number {
    return this.totalPagesValue;
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages() - 1) {
      this.loadRequests(this.pageIndex + 1);
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.loadRequests(this.pageIndex - 1);
    }
  }

  openApproveModal(request: any): void {
    this.selectedPaymentSchedule = request;
    console.log('Approve modal data:', this.selectedPaymentSchedule);
    this.isApproveModalOpen = true;
  }
  closeApproveModal(): void {
    this.isApproveModalOpen = false;
  }
  handleApproval(): void {
    this.closeApproveModal();
    this.loadRequests();
  }

  openRejectModal(request: any): void {
    this.selectedPaymentSchedule = request;
    console.log('Reject modal data:', this.selectedPaymentSchedule);
    this.isRejectModalOpen = true;
  }
  closeRejectModal(): void {
    this.isRejectModalOpen = false;
  }
  handleRejection(reason: string): void {
    console.log('Request rejected for reason:', reason);
    this.closeRejectModal();
    this.loadRequests();
  }

  openViewDetailsModal(request: any): void {
    this.selectedPaymentSchedule = request;
    console.log('View Details modal data:', this.selectedPaymentSchedule);
    this.isViewDetailsModalOpen = true;
  }
  closeViewDetailsModal(): void {
    this.isViewDetailsModalOpen = false;
  }
}
