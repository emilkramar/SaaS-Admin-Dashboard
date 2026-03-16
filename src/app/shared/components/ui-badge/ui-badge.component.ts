import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeColor = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';

@Component({
  selector: 'app-ui-badge',
  imports: [NgClass],
  templateUrl: './ui-badge.component.html',
  styleUrl: './ui-badge.component.css',
  standalone: true
})
export class UiBadgeComponent {
  value = input<string | number>('');
  color = input<BadgeColor>('neutral');
}
