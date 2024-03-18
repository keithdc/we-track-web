import {Component, OnInit, ViewChild} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {Router} from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
  ],
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit {
  @ViewChild(MatDrawer) matDrawer: MatDrawer | undefined;

  constructor(private router: Router,) {
  }

  ngOnInit(): void {
  }

  public routeTo(route: string): void {
    this.router.navigate([route]).then();
    if (this.matDrawer) {
      this.matDrawer.toggle().then();
    }
  }
}
