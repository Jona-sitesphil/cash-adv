import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Received Data in modal:', data);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
