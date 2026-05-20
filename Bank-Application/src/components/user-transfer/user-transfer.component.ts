import { Component } from '@angular/core';
import { Account } from '../../models/account';
import { AccountService } from '../../core/services/account.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transactions';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-user-transfer',
  standalone: true,
  imports: [CurrencyPipe,ReactiveFormsModule],
  templateUrl: './user-transfer.component.html',
  styleUrl: './user-transfer.component.css',
  providers:[DatePipe]
})
export class UserTransferComponent {
  tId:number=45;
  userId!:number;
  constructor(private _AccountService:AccountService,private _FormBuilder:FormBuilder,private _TransactionService:TransactionService, private _DatePipe:DatePipe){}
  account!:Account;
  accounts!:Account[];
  ngOnInit():void{
    const user =localStorage.getItem('currentUser');
 
    if(user){
     const userData=JSON.parse(user);
     this.userId=userData.userId;
  this._AccountService.getUserById(this.userId.toString()).subscribe({
next:(res)=>{
  if(res)
  this.account=res;
}
    })
    }
    this._AccountService.getAllAccounts().subscribe({
      next:(res)=>{
        this.accounts=res
      }
    })
  }
transferForm:FormGroup=this._FormBuilder.group({
  ToAccountNo:['',[Validators.required]],
  fromAccountNo:['',[Validators.required]],
  amount:['',[Validators.required]],
  description:['']
});

newTransaction!:Transaction;
todayDate=new Date();
formatedDate=this._DatePipe.transform(this.todayDate,
  "yyyy-MM-dd'T'HH:mm:ss'Z'"
)
transferFunds():void{
  if(this.transferForm.valid){
    this.tId+=1;
  console.log(this.transferForm.value);
  this.newTransaction={
    ToAccountNo:this.transferForm.value.ToAccountNo,
   fromAccountNo:this.transferForm.value.fromAccountNo,
   amount:this.transferForm.value.amount,
   date:this.todayDate,
   type:'credit',
   description:this.transferForm.value.description,
   id:this.tId.toString()

  }
  if(this.transferForm.value.amount<=this.account?.balance){
  this._TransactionService.makeNewTransaction(this.newTransaction).subscribe({
    next:()=>{
      const updatedSender:Account={
     ...this.account,
        balance:(this.account.balance-this.newTransaction.amount),
       userId:this.userId

      }

      this._AccountService.updateUser(updatedSender, this.userId).subscribe({
        next: (res) => {
          this.account = res; 
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

  })
  this._AccountService.getAllAccounts().subscribe({
    next:(acc)=>{
      const receiver=acc.find((ac)=>ac.accountNo===this.newTransaction.ToAccountNo);
      if(receiver){
        const updatedReceiver: Account = {
          ...receiver,
          balance: receiver.balance + this.newTransaction.amount
        };
  
        this._AccountService.updateUser(updatedReceiver, receiver.userId).subscribe({
          next: (res) => {
            console.log('Receiver updated:', res);
          },
          error: (err) => {
            console.error('Failed to update receiver:', err);
          }
        });
      }
    }
  });
  
}
else{
alert("insufficent Balance");
}

  }
 else{
  alert('invalid transfer');
 } 
 this.transferForm.reset();


}



}
