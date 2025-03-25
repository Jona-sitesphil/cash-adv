import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-schedule',
  standalone: true,
  imports: [MatTableModule, MatCardModule, CommonModule],
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css'],
})
export class PaymentScheduleComponent {
  @Input() paymentSchedule: any = {};
  @Input() employeeName: string = '';

  @Output() closeModalEvent = new EventEmitter<void>();
  displayedColumns: string[] = [
    'userName',
    'requestDate',
    'neededDate',
    'amount',
    'reason',
  ];
  closeModal(): void {
    this.closeModalEvent.emit();
  }
}
