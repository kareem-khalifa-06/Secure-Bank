import { FilterTransactionsPipe } from './../../pipes/filter-transactions.pipe';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../models/transactions';
import { CurrencyPipe, DatePipe, NgClass, CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account';

@Component({
  selector: 'app-user-transaction',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, CommonModule, FilterTransactionsPipe, FormsModule],
  templateUrl: './user-transaction.component.html',
  styleUrl: './user-transaction.component.css'
})
export class UserTransactionComponent implements OnInit {
  userAccounts: Account[] = [];
  t: Transaction[] = [];
  filterType: string = 'All';
  searchTerm: string = '';
  selectedIndex: number = 0;

  get selectedAccount(): Account | null {
    return this.userAccounts[this.selectedIndex] ?? null;
  }

  get accountNo(): string {
    return this.selectedAccount?.accountNo ?? '';
  }

  selectAccount(index: number): void {
    this.selectedIndex = index;
    // reset filters on account switch
    this.filterType = 'All';
    this.searchTerm = '';
  }

  constructor(
    private _TransactionService: TransactionService,
    private _AccountService: AccountService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      this._AccountService.getUserAccounts(userData.userId).subscribe({
        next: (accounts) => {
          this.userAccounts = accounts;
        }
      });
    }

    this._TransactionService.getAllTransactions().subscribe({
      next: (res) => { this.t = res; },
      error: (err) => { console.error(err); }
    });
  }
}