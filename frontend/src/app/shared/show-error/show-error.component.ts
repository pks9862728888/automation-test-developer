import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent {

  @Input() errorMessage!: string;

  constructor() { }

}
