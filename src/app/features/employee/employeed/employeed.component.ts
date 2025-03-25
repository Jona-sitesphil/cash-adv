import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EmployeeModalComponent } from '../../../core/employee-modal/employee-modal.component';
import { FeaturesService } from '../../features.service';

@Component({
  selector: 'app-employeed',
  templateUrl: './employeed.component.html',
  styleUrls: ['./employeed.component.css'],
  imports: [FormsModule, CommonModule, MatIcon, EmployeeModalComponent],
  standalone: true,
})
export class EmployeedComponent implements OnInit {
  isModalOpen = false;
  requests: any[] = [];

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  // Open the New Request modal
  openEmployeeModal(): void {
    this.isModalOpen = true;
    console.log('Opening modal...');
  }

  // Close the New Request modal
  closeEmployeeModal(): void {
    this.isModalOpen = false;
  }

  // When a new request is submitted
  // If event.refresh is true, force a full page reload after a small delay
  addNewRequest(event: { refresh: boolean; newRequest: any }): void {
    if (event.refresh) {
      // Force a full reload so the page immediately reflects the new changes
      setTimeout(() => {
        window.location.reload();
      }, 500); // 500ms delay for smooth UI transition
    } else {
      // Alternatively, append the new request without a full reload
      this.requests.push(event.newRequest);
    }
    this.closeEmployeeModal();
  }

  // Load self requests from the backend
  loadRequests(): void {
    this.featuresService.getSelfRequests().subscribe({
      next: (response: any) => {
        // Assuming the API returns data in response.data.cashAdvanceRequests
        this.requests = response.data.cashAdvanceRequests;
      },
      error: (err: any) => console.error('Error loading requests:', err),
    });
  }
}
