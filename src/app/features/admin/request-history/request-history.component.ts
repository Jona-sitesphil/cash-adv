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

  constructor(
    private featuresService: FeaturesService,
    public dialog: MatDialog,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loaderService.show(); // Show loader before API call

    this.featuresService.getRequests().subscribe({
      next: (response: any) => {
        this.requests = response.data.cashAdvanceRequests;
        this.applyFilters();
        this.loaderService.hide(); // Hide loader after successful data fetch
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.loaderService.hide(); // Ensure loader stops even on error
      },
    });
  }

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

  openHistoryView(request: any): void {
    this.dialog.open(HistoryViewComponent, {
      width: '500px',
      data: { request },
    });
  }
}
