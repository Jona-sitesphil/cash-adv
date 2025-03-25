import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [MatTableModule, MatCardModule,CommonModule],
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css']
})
export class PaymentScheduleComponent {
  // The array of row(s) we want to display
  @Input() paymentSchedule: any[] = [];
  // Name of the employee, shown in the title
  @Input() employeeName: string = '';

  // Emit this event so the parent can hide this modal
  @Output() closeModalEvent = new EventEmitter<void>();

  // Columns to display (matching the main table)
  displayedColumns: string[] = [
    'userName',
    'requestDate',
    'neededDate',
    'amount',
    'reason'
  ];

  closeModal(): void {
    this.closeModalEvent.emit();
  }
}
