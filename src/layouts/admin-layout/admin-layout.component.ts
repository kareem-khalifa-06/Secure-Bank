import { Component } from '@angular/core';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminNavComponent,RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
