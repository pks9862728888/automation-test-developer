import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent {

  @Input() diameter: number = 30;
  @Input() spinnerText?: string;

  constructor() { }

}
