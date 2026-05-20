

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent {
constructor(
  private _Formbuilder:FormBuilder,
  private _Router:Router,
private _AuthService:AuthService){}

  loginForm:FormGroup=this._Formbuilder.group({
    Username:[null,[Validators.required]],
    Password:[null,[Validators.required]]
  });
  submit():void{
    console.log(this._AuthService.login(this.loginForm.value.Username,this.loginForm.value.Password).subscribe());
    if(this.loginForm.valid){
     this._AuthService.getAllUsers();
     if(this._AuthService.login(this.loginForm.value.Username,this.loginForm.value.Password).subscribe()){
      const role=this._AuthService.getRole();
      if(role==='Admin'){
this._Router.navigate(['/admin/home']);
      }
      if(role==='User'){
this._Router.navigate(['/user/home']);
      }
     }
    else{

      alert('wrong credentials');
      this._Router.navigate(['/login']);
      this.loginForm.reset();
    }

  }
 
  }

}
