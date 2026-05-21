import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transactions';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
})
export class UserAccountComponent implements OnInit {
  constructor(
    private _AccountService: AccountService,
    private _TransactionService: TransactionService
  ) {}

  userAccounts: Account[] = [];        
  allTransactions: Transaction[] = [];

  selectedAccount: Account | null = null;
  selectedIndex: number = 0;

  get accountTransactions(): Transaction[] {
    if (!this.selectedAccount) return [];
    const accountNo = this.selectedAccount.accountNo;
    return this.allTransactions
      .filter((t) => t.fromAccountNo === accountNo || t.ToAccountNo === accountNo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }

  selectAccount(index: number): void {
    this.selectedIndex = index;
    this.selectedAccount = this.userAccounts[index];
  }

   ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this._AccountService.getUserAccounts(userData.userId).subscribe({
        next: (accounts) => {   
          this.userAccounts = accounts;
          if (accounts.length > 0) {      
            this.selectedAccount = accounts[0];
          }
        },
      });
    }
 
    this._TransactionService.getAllTransactions().subscribe({
      next: (res: Transaction[]) => {
        this.allTransactions = res;
      },
    });
  }
}