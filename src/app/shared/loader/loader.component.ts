import { NgIf, CommonModule, AsyncPipe } from '@angular/common';
// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

  ngOnInit(): void {
    console.log('Loader component initialized');
  }
}
