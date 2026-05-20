import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
base_url='http://localhost:3000/';
  constructor(private _HttpClient:HttpClient) { }
  getAllTransactions():Observable<Transaction[]>{
    return this._HttpClient.get<Transaction[]>(this.base_url+'Transaction');
     
}
makeNewTransaction(newTransaction: Transaction): Observable<Transaction> {
  return this._HttpClient.post<Transaction>(
    this.base_url + 'Transaction',
    newTransaction
  );
}
deleteTransaction(id: string): Observable<void> {
  return this._HttpClient.delete<void>(`https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Transaction/${id}`);
}

}