import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EmployeeModalComponent } from '../../../core/employee-modal/employee-modal.component';
import { FeaturesService } from '../../features.service';

@Component({
  selector: 'app-employeed',
  templateUrl: './employeed.component.html',
  styleUrls: ['./employeed.component.css'],
  imports: [FormsModule, CommonModule, MatIcon, EmployeeModalComponent],
})
export class EmployeedComponent {
  isModalOpen = false;
  requests: any[] = []; // Declare the requests property
  constructor(private featuresService: FeaturesService) {}

  // requests = [
  //   {
  //     id: 'kc',
  //     description: 'Travel expenses for client meeting',
  //     amount: 1500.0,
  //     dateNeeded: 'Jun 15, 2023',
  //     requestedDate: 'Jun 1, 2023',
  //     status: 'Approved',
  //   },
  //   {
  //     id: 'kimcarl',
  //     description: 'Office supplies purchase',
  //     amount: 500.0,
  //     dateNeeded: 'Jul 5, 2023',
  //     requestedDate: 'Jul 1, 2023',
  //     status: 'Pending',
  //   },
  // ];

  // filteredRequests = [...this.requests];

  // filterRequests(status: string) {
  //   this.filteredRequests =
  //     status === 'all'
  //       ? [...this.requests]
  //       : this.requests.filter((req) => req.status.toLowerCase() === status);
  // }

  ngOnInit(): void {
    this.loadRequests();
  }

  openEmployeeModal() {
    this.isModalOpen = true;
    console.log('Opening modal...');
  }

  closeEmployeeModal() {
    this.isModalOpen = false;
  }

  addNewRequest(event: { refresh: boolean, newRequest: any }): void {
    if (event.refresh) {
      // Refresh the entire list from the backend.
      this.loadRequests();
    } else {
      // Optionally, if you want to just append:
      this.requests.push(event.newRequest);
    }
    this.closeEmployeeModal();
  }
  
  loadRequests(): void {
    this.featuresService.getSelfRequests().subscribe({
      next: (response: any) => {
        // Assuming the API returns the data in response.data.cashAdvanceRequests
        this.requests = response.data.cashAdvanceRequests;
        // this.filteredRequests = [...this.requests];
      },
      error: (err) => console.error('Error loading requests:', err),
    });
  }
}
