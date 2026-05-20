import { FilterTransactionsPipe } from './../../pipes/filter-transactions.pipe';
import { Component } from '@angular/core';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../models/transactions';
import { CurrencyPipe, DatePipe, NgClass, CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-transaction',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, NgClass, CommonModule, FilterTransactionsPipe,FormsModule],
  templateUrl: './user-transaction.component.html',
  styleUrl: './user-transaction.component.css'
})
export class UserTransactionComponent {
  accountNo!: string | undefined;
  t: Transaction[] = [];

  constructor(
    private _TransactionService: TransactionService,
    private _AccountService: AccountService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      const userId = userData.userId;
      
      this._AccountService.getUserById(userId).subscribe({
        next: (u) => {
          this.accountNo = u?.accountNo;
          console.log(this.accountNo)
        }
      });
    }

    this._TransactionService.getAllTransactions().subscribe({
      next: (res) => {
        this.t = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  filterType:string='All';
  searchTerm: string='';
 
  
}
