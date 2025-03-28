import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EmployeeModalComponent } from '../../../core/employee-modal/employee-modal.component';
import { FeaturesService } from '../../features.service';
import { DetailsempComponent } from '../../../core/detailsemp/detailsemp.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employeed',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIcon, EmployeeModalComponent],
  templateUrl: './employeed.component.html',
  styleUrls: ['./employeed.component.css'],
})
export class EmployeedComponent implements OnInit {
  isEmployeeModalOpen = false;
  requests: any[] = [];

  constructor(
    private featuresService: FeaturesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  openEmployeeModal(): void {
    this.isEmployeeModalOpen = true;
    console.log('Opening employee modal...');
  }

  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
  }

  openDetailsempModal(request: any): void {
    console.log('Opening details modal...', request);
    this.dialog.open(DetailsempComponent, {
      width: '600px',
      data: { request },
    });
  }

  addNewRequest(event: { refresh: boolean; newRequest: any }): void {
    if (event.refresh) {
      setTimeout(() => window.location.reload(), 500);
    } else {
      this.requests.push(event.newRequest);
    }
    this.closeEmployeeModal();
  }

  loadRequests(): void {
    this.featuresService.getSelfRequests().subscribe({
      next: (response: any) => {
        this.requests = response.data.cashAdvanceRequests;
      },
      error: (err: any) => console.error('Error loading requests:', err),
    });
  }
  refreshPage(): void {
    window.location.reload();
  }
}
