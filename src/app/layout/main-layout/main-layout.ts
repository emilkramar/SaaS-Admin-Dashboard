import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { ShellLayoutService } from '../shell-layout.service';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  providers: [ShellLayoutService],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
  standalone: true,
})
export class MainLayout {
  protected shell = inject(ShellLayoutService);
}
