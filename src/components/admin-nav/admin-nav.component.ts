import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ViewChild,ElementRef } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-nav.component.html',
  styleUrl: './admin-nav.component.css'
})
export class AdminNavComponent {
constructor(public _AuthService:AuthService){}
@ViewChild('user') p!:ElementRef;
ngAfterViewInit():void{
 
this.p.nativeElement.innerHTML= `Welcome, ${this._AuthService.getUserName()}`


}
}
