import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account';
import { AccountService } from '../../core/services/account.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transactions';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-user-transfer',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './user-transfer.component.html',
  styleUrl: './user-transfer.component.css',
  providers: [DatePipe],
})
export class UserTransferComponent implements OnInit {
  userId!: number;
  nextId: number = 1; 

  senderAccounts: Account[] = [];
  reciverAccounts: Account[] = [];

  transferForm: FormGroup = this._FormBuilder.group({
    ToAccountNo:   ['', Validators.required],
    fromAccountNo: ['', Validators.required],
    amount:        ['', [Validators.required, Validators.min(0.01)]],
    description:   [''],
  });

  constructor(
    private _AccountService: AccountService,
    private _FormBuilder: FormBuilder,
    private _TransactionService: TransactionService,
    private _DatePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    
    this._TransactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        console.log(transactions)
        if (transactions.length > 0) {
          const maxId = Math.max(...transactions.map((t) => Number(t.id)));
          this.nextId = maxId + 1;
        }
      },
    });

    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.userId;
      this._AccountService.getUserAccounts(this.userId).subscribe({
        next: (res) => {
          this.senderAccounts = res ?? [];
          if (this.senderAccounts.length > 0) {
            this.transferForm.get('fromAccountNo')?.setValue(this.senderAccounts[0].accountNo);
          }
        },
      });
    }

    this._AccountService.getAllAccounts().subscribe({
      next: (res) => { this.reciverAccounts = res; },
    });
  }

  getSelectedSender(): Account | undefined {
    const selectedNo = this.transferForm.get('fromAccountNo')?.value;
    return this.senderAccounts.find((a) => a.accountNo === selectedNo);
  }

  transferFunds(selectedAccount: Account | undefined): void {
    if (!selectedAccount) {
      alert('Please select a sender account.');
      return;
    }
    if (this.transferForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const { ToAccountNo, fromAccountNo, amount, description } = this.transferForm.value;

    if (amount > selectedAccount.balance) {
      alert('Insufficient balance.');
      return;
    }

    const newTransaction: Transaction = {
      id:           this.nextId.toString(), 
      ToAccountNo,
      fromAccountNo,
      amount:       Number(amount),
      date:         this._DatePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'") ?? '',
      type:         'credit',
      description:  description ?? '',
    };

    this._TransactionService.makeNewTransaction(newTransaction).subscribe({
      next: () => {
        this.nextId++; 

        
        const updatedSender: Account = {
          ...selectedAccount,
          balance: selectedAccount.balance - Number(amount),
        };
        this._AccountService.updateUser(updatedSender, this.userId).subscribe({
          error: (err) => console.error('Failed to update sender:', err),
        });

       
        this._AccountService.getAllAccounts().subscribe({
          next: (accounts) => {
            const receiver = accounts.find((a) => a.accountNo === ToAccountNo);
            if (receiver) {
              const updatedReceiver: Account = {
                ...receiver,
                balance: receiver.balance + Number(amount),
              };
              this._AccountService.updateUser(updatedReceiver, receiver.userId).subscribe({
                error: (err) => console.error('Failed to update receiver:', err),
              });
            }
          },
        });

        alert('Transfer successful!');
        this.transferForm.reset();
        if (this.senderAccounts.length > 0) {
          this.transferForm.get('fromAccountNo')?.setValue(this.senderAccounts[0].accountNo);
        }
      },
      error: (err) => console.error('Transaction failed:', err),
    });
  }
}