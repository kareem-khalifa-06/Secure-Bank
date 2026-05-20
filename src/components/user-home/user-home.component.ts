import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {
constructor(public _AuthService:AuthService){}
@ViewChild('user') p!:ElementRef;
ngAfterViewInit():void{
 
this.p.nativeElement.innerHTML= `Welcome back, ${this._AuthService.getUserName()}!`
}
}