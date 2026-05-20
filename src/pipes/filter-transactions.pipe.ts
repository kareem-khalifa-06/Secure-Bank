import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../models/transactions';

@Pipe({
  name: 'filterTransactions',
  standalone: true
})
export class FilterTransactionsPipe implements PipeTransform {
  transform(transactions: Transaction[] | null, filterType: string, searchTerm: string, accountNumber: string|undefined): Transaction[] {
    if (!transactions) {
      return [];
    }

    let filteredTransactions = [...transactions];

    if (filterType && filterType !== 'All') {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchTerm) {
      filteredTransactions = filteredTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if(accountNumber){
      filteredTransactions=filteredTransactions.filter(transaction=>transaction.fromAccountNo===accountNumber||transaction.ToAccountNo===accountNumber);
    }

    return filteredTransactions;
  }
}
