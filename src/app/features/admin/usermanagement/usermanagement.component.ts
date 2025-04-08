import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { FeaturesService } from './../../features.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { LoaderService } from '../../../loader.service';
import { AddUserModalComponent } from '../../../core/adduser-modal/adduser-modal.component';
import { EditUserModalComponent } from '../../../editusermodal/editusermodal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DisableComponent } from '../../../core/disable/disable.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    LoaderComponent,
    AddUserModalComponent,
    EditUserModalComponent,
    MatDialogModule,
  ],
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  requests: any[] = [];
  totalPagesValue: number = 0;
  userManagementStats: any = {};

  isSidebarOpen: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 10;
  isModalOpen: boolean = false;
  isEditUserModalOpen: boolean = false;
  selectedUser: any = null;
  isDisableUserModalOpen: any;
  isDisableOpen: any;
  isEnableduserModalopen: any;
  isEnabledopen: any;

  constructor(
    private featuresService: FeaturesService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRequests();
    this.loadUserManagementStats();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadRequests(page: number = this.pageIndex): void {
    this.loaderService.show();
    this.featuresService.getUserDetails(page + 1, this.pageSize).subscribe({
      next: (response: any) => {
        this.requests = response.data.users;
        this.totalPagesValue = response.data.totalPages;
        this.pageIndex = response.data.currentPage - 1;
        this.loaderService.hide();
      },
      error: (err: any) => {
        console.error('Failed to load user details', err);
        this.loaderService.hide();
      },
    });
  }

  loadUserManagementStats(): void {
    this.featuresService.getUserManagementStats().subscribe({
      next: (stats) => (this.userManagementStats = stats),
      error: (err) => console.error('Failed to load user stats', err),
    });
  }

  handleUserUpdated(updatedUser: any): void {
    console.log('User updated:', updatedUser);
    this.featuresService.updateUser(updatedUser.id, updatedUser).subscribe({
      next: () => {
        const index = this.requests.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          this.requests[index] = updatedUser;
        }
        this.isEditUserModalOpen = false;
      },
      error: (err: any) => {
        console.error('Failed to update user', err);
      },
    });
  }

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

  refreshPage(): void {
    this.loadRequests();
    this.loadUserManagementStats();
  }

  openAddUserModal(): void {
    this.isModalOpen = true;
  }

  openEditUserModal(user: any): void {
    this.selectedUser = user;
    this.isEditUserModalOpen = true;
  }

  enableUser(user: any): void {
    this.featuresService.enableUser(user.id).subscribe({
      next: () => {
        // After enabling, update the visibilityStatus to 'Enabled'
        const index = this.requests.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.requests[index].visibilityStatus = 'Enabled';  // Mark the status as Enabled
        }
        console.log(`User ${user.name} enabled successfully.`);
        this.refreshPage();  // Refresh the list to reflect the change
      },
      error: (err: any) => {
        console.error('Failed to enable user:', err);
      },
    });
  }
  
  openEnableModal(user: any): void {
    const dialogRef = this.dialog.open(DisableComponent, {
      width: '400px',
      data: {
        title: 'Enable User',
        message: `Are you sure you want to enable ${user.name}?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.enableUser(user);  // Call the enableUser method
      }
    });
  }
  
  openDisableModal(user: any): void {
    const dialogRef = this.dialog.open(DisableComponent, {
      width: '400px',
      data: {
        title: 'Disable User',
        message: `Are you sure you want to disable ${user.name}?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.disableUser(user);  // Call the disableUser method
      }
    });
  }
  
  disableUser(user: any): void {
    this.featuresService.disableUser(user.id).subscribe({
      next: () => {
        // After disabling, update the visibilityStatus to 'Disabled'
        const index = this.requests.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.requests[index].visibilityStatus = 'Disabled';  // Mark the status as Disabled
        }
        console.log(`User ${user.name} disabled successfully.`);
        this.refreshPage();  // Refresh the list to reflect the change
      },
      error: (err: any) => {
        console.error('Failed to disable user:', err);
      },
    });
  }
  

  // enableUser(user: any): void {
  //   this.featuresService.enableUser(user.id).subscribe({
  //     next: () => this.refreshPage(),
  //     error: (err) => console.error('Failed to enable user', err),
  //   });
  // }
}
