import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-disable',
  standalone: true,
  imports: [MatDialogModule],

  templateUrl: './disable.component.html',
  styleUrls: ['./disable.component.css'],
})
export class DisableComponent {
  constructor(
    private dialogRef: MatDialogRef<DisableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
