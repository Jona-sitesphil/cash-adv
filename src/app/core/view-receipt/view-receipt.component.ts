import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-receipt',
  template: `
    <div class="receipt-modal">
      <h2>Receipt Preview</h2>
      <img [src]="data.receiptUrl" alt="Receipt Image" class="receipt-image" />
    </div>
  `,
  styles: [
    `
      .receipt-modal {
        text-align: center;
      }
      .receipt-image {
        max-width: 100%;
        height: auto;
      }
    `,
  ],
})
export class ViewReceiptComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { receiptUrl: string }) {}

  ngOnInit(): void {
    console.log('Dialog image');
  }
}
