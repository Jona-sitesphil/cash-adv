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

  constructor(
    private featuresService: FeaturesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.featuresService.getRequests().subscribe({
      next: (response: any) => {
        // Map the response correctly using camelCase field names:
        this.requests = response.data.cashAdvanceRequests;
      },
      error: (err) => console.error('Error loading requests:', err),
    });
  }

  openHistoryView(request: any): void {
    // Adjust the mapping to use the correct fields from the API:
    this.dialog.open(HistoryViewComponent, {
      width: '500px',
      data: {
        requestDate: request.requestDate,        // Changed from request.request_date
        amount: request.amount,
        status: request.requestStatus,             // Changed from request.status
        decisionDate: request.updatedAt,           // Changed from request.decision_date
        purpose: request.reason,                   // Changed from request.purpose
        paymentSchedule: request.paymentSchedule || [],
        processedBy: request.reviewedBy,           // Changed from request.processed_by
      },
    });
  }
}
