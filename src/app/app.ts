import { Component, signal } from '@angular/core';
import {Header} from './layout/header/header';
import {Sidebar} from './layout/sidebar/sidebar';
import {MainLayout} from './layout/main-layout/main-layout';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    Sidebar,
    MainLayout
  ],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {
}
