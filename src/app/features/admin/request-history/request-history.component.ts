import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HistoryViewComponent } from '../../../core/history-view/history-view.component';
import { FeaturesService } from '../../features.service';
import { LoaderService } from '../../../loader.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    MatTableModule,
    LoaderComponent,
  ],
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.css'],
})
export class RequestHistoryComponent implements OnInit {
  isSidebarOpen = false;
  selectedStatus = '';
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';

  requests: any[] = [];
  filteredRequests: any[] = [];
  totalPagesValue: number = 0;
  totalCount: number = 0;
  pageIndex: number = 0; // Local 0-based page index
  pageSize: number = 10; // Rows per page

  constructor(
    private featuresService: FeaturesService,
    public dialog: MatDialog,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadRequests(); // Initial data load
  }

  // Loads the paginated requests from the backend.
  loadRequests(
    page: number = this.pageIndex,
    pageSize: number = this.pageSize
  ): void {
    this.loaderService.show(); // Show loader before API call

    this.featuresService
      .getRequests(
        page + 1,
        pageSize,
        this.selectedStatus,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (response: any) => {
          if (response?.data) {
            this.requests = response.data.cashAdvanceRequests || [];
            this.totalPagesValue = response.data.totalPages ?? 0;
            this.pageIndex = (response.data.currentPage ?? 1) - 1; // Ensure 0-based index
            this.totalCount = response.data.totalRecords ?? 0; // Store total count for pagination
          }

          this.applyFilters(); // Apply filters after data load
          this.loaderService.hide(); // Hide loader after data is fetched
        },
        error: (err) => {
          console.error('Error loading requests:', err);
          this.loaderService.hide(); // Ensure loader stops even on error
        },
      });
  }

  // Applies filters based on selected filters and search term
  applyFilters(): void {
    this.filteredRequests = this.requests.filter((request) => {
      const matchesSearch =
        !this.searchTerm ||
        request.userName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        !this.selectedStatus || request.requestStatus === this.selectedStatus;

      const matchesStartDate =
        !this.startDate ||
        new Date(request.requestDate) >= new Date(this.startDate);

      const matchesEndDate =
        !this.endDate ||
        new Date(request.requestDate) <= new Date(this.endDate);

      return (
        matchesSearch && matchesStatus && matchesStartDate && matchesEndDate
      );
    });
  }

  // Opens a modal to view request details
  openHistoryView(request: any): void {
    this.dialog.open(HistoryViewComponent, {
      width: '500px',
      data: { request },
    });
  }

  // Total number of pages for pagination
  totalPages(): number {
    return this.totalPagesValue;
  }

  // Go to the next page if there are more pages
  nextPage(): void {
    if (this.pageIndex < this.totalPages() - 1) {
      this.pageIndex++;
      this.loadRequests(this.pageIndex); // Load the next page
    }
  }

  // Go to the previous page if there are previous pages
  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadRequests(this.pageIndex); // Load the previous page
    }
  }
  refreshPage(): void {
    window.location.reload();
  }
}
