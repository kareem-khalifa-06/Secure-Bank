import { Component } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transactions';
import { TransactionService } from '../../core/services/transaction.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgClass],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent {
constructor(private _AccountService:AccountService, private _TransactionService:TransactionService){}
u!:Account|undefined;
accountNumber!:string|undefined
accountType!:string|undefined
accountBalance!:number|undefined
t!:Transaction[];
 ngOnInit():void{
  
const user=localStorage.getItem('currentUser');
if(user){
  const userData=JSON.parse(user);
      const userId=userData.userId;
   this._AccountService.getUserById(userId).subscribe({
    next:(user)=>{
      this.u=user;
   this.accountType=this.u?.accountType;
  this.accountNumber=this.u?.accountNo;
  this.accountBalance=this.u?.balance
  
    }
   })
}
this._TransactionService.getAllTransactions().subscribe({
  next:(res)=>{
    this.t=res;
  }
})  
 
 }




}
