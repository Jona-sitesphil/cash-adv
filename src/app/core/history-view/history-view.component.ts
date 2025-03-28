import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FeaturesService } from '../../features/features.service';
@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './history-view.component.html',
  styleUrls: ['./history-view.component.css'],
})
export class HistoryViewComponent {
  constructor(
    public dialogRef: MatDialogRef<HistoryViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private featuresService: FeaturesService
  ) {
    console.log('Received Data:', data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event, payment: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      payment.selectedFile = input.files[0];
      payment.selectedFileName = payment.selectedFile.name;
    }
  }


}
