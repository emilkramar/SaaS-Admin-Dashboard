import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export type UiButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'app-ui-button',
  imports: [NgClass],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.css',
  standalone: true,
})
export class UiButtonComponent {
  label = input<string>('');
  variant = input<UiButtonVariant>('primary');
  clicked = output<void>();

  hostClass = computed(() =>
    this.variant() === 'primary'
      ? 'ui-button ui-button--primary'
      : 'ui-button ui-button--secondary',
  );
}
