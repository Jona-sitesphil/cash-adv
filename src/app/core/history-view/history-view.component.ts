import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

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
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    console.log('Received Data:', data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
