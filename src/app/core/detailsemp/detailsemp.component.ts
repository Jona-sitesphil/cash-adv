import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FeaturesService } from '../../features/features.service';
import { ViewReceiptComponent } from '../view-receipt/view-receipt.component';

@Component({
  selector: 'app-detailsemp',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './detailsemp.component.html',
  styleUrls: ['./detailsemp.component.css'],
})
export class DetailsempComponent {
  constructor(
    public dialogRef: MatDialogRef<DetailsempComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient, // Inject HttpClient
    private featuresService: FeaturesService,
    private dialog: MatDialog // Properly inject MatDialog here
  ) {
    console.log('Received Data in modal:', data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event, payment: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      payment.selectedFile = input.files[0];
      payment.selectedFileName = payment.selectedFile.n2ame;
    }
  }

  uploadReceipt(payment: any): void {
    if (!payment.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    if (!payment.id) {
      alert('Missing payment ID.');
      console.error('Payment object:', payment);
      return;
    }

    console.log('Uploading receipt for Payment ID:', payment.id);

    const formData = new FormData();
    formData.append('receiptImage', payment.selectedFile);

    // Retrieve the auth token from sessionStorage
    const authToken = sessionStorage.getItem('auth_token');

    // Set the headers with the token
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };
    this.http
      .put(
        `http://10.0.0.12:5249/api/CashAdvanceRequest/Upload-Receipt/${payment.id}`,
        formData,
        { headers } // Attach the headers
      )
      .subscribe({
        next: () => {
          alert(`Receipt uploaded successfully for ${payment.paymentDate}!`);
          payment.selectedFile = null;
          payment.selectedFileName = '';
        },
        error: (error) => {
          console.error('Upload failed:', error);
          alert('Failed to upload receipt. Please try again.');
        },
      });
  }
  // Use the imageFilePath instead of the payment ID.
  openReceiptModal(imageFilePath: string): void {
    this.featuresService.getUploadedReceipt(imageFilePath).subscribe({
      next: (receiptUrl) => {
        this.dialog.open(ViewReceiptComponent, {
          data: { receiptUrl },
          width: '600px',
        });
      },
      error: (err) => {
        console.error('Error retrieving receipt:', err);
        alert('Error retrieving receipt');
      },
    });
  }
}
