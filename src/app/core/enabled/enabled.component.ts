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
  buttonLabel?: string; // Optional field for dynamic button text
}

@Component({
  selector: 'app-enabled',
  standalone: true,
  imports: [MatDialogModule],

  templateUrl: './enabled.component.html',
  styleUrls: ['./enabled.component.css'],
})
export class EnabledComponent {
  constructor(
    private dialogRef: MatDialogRef<EnabledComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
