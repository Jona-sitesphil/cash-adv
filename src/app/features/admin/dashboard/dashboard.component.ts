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
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { LoaderService } from '../../../loader.service';

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
    LoaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  requests: any[] = [];
  totalCount: number = 0; // Total number of records returned from API
  totalPagesValue: number = 0; // Total pages from API
  dashboardStats: any = {};

  // jonadata: any[] = [
  //   { label: 'Total Request', count: 7 },
  //   { label: 'Pending Request', count: 4 },
  //   { label: 'Approved this Month', count: 3 },
  // ];
  isSidebarOpen: boolean = false;

  isApproveModalOpen: boolean = false;
  isRejectModalOpen: boolean = false;
  isViewDetailsModalOpen: boolean = false;
  selectedPaymentSchedule: any = {};

  // Pagination settings
  pageIndex: number = 0; // Local 0-based page index
  pageSize: number = 10; // 10 rows per page
  allCount: number = 0;
  pendingCount: number = 0;
  approvedThisMonth: number = 0;

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // Loads the paginated requests from the backend.
  loadRequests(page: number = this.pageIndex): void {
    this.loaderService.show(); // Show loader before API call

    this.featuresService
      .getRequestsPaginated(page + 1, this.pageSize)
      .subscribe({
        next: (response: any) => {
          // Set the data
          this.requests = response.data.cashAdvanceRequests;
          this.allCount = response.data.allCount;
          this.pendingCount = response.data.pendingCount;
          this.approvedThisMonth = response.data.approvedThisMonth;
          this.totalCount = response.data.totalRecords;
          this.totalPagesValue = response.data.totalPages;
          this.pageIndex = response.data.currentPage - 1;

          // Hide loader after data is loaded
          this.loaderService.hide();
        },
        error: (err: any) => {
          console.error('Failed to load requests', err);

          // Hide loader even in case of an error to prevent infinite loading state
          this.loaderService.hide();
        },
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
  refreshPage(): void {
    window.location.reload();
  }

  onReceiptUploadSuccess(): void {
    console.log('Receipt upload successful! Reloading requests...');
    this.loadRequests(); // Call the API to reload data
  }
}
