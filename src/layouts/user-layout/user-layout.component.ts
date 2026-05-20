import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserNavComponent } from '../../components/user-nav/user-nav.component';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet,UserNavComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
