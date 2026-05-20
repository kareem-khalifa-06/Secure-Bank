import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {
constructor(public _AuthService:AuthService){}
@ViewChild('user') p!:ElementRef;
ngAfterViewInit():void{
 
this.p.nativeElement.innerHTML= `Welcome back, ${this._AuthService.getUserName()}!`
}
}
