import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToolbarComponent} from './toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [
    RouterOutlet,
    ToolbarComponent
  ],
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
