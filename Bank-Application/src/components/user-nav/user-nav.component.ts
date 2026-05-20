import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RouterLink } from "@angular/router";
import { RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-user-nav',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent {
constructor(public _AuthService:AuthService){}
@ViewChild('user') p!:ElementRef;
ngAfterViewInit():void{
 
this.p.nativeElement.innerHTML= `Welcome, ${this._AuthService.getUserName()}`
}


 


}
