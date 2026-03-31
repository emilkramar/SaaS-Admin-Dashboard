import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  imports: [],
  templateUrl: './ui-card.component.html',
  styleUrl: './ui-card.component.css',
  standalone: true,
})
export class UiCardComponent {
  title = input<string>('');
}
