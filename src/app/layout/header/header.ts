import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme/theme.service';
import { ShellLayoutService } from '../shell-layout.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header {
  protected shell = inject(ShellLayoutService);
  protected theme = inject(ThemeService);
}
