import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Transaction } from "../../models/transactions";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  base_url = "secure-bank-production-f90d.up.railway.app/";
  constructor(private _HttpClient: HttpClient) {}
  getAllTransactions(): Observable<Transaction[]> {
    return this._HttpClient.get<Transaction[]>(this.base_url + "Transaction");
  }
  makeNewTransaction(newTransaction: Transaction): Observable<Transaction> {
    return this._HttpClient.post<Transaction>(
      this.base_url + "Transaction",
      newTransaction,
    );
  }
  deleteTransaction(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`${this.base_url}Transaction/${id}`);
  }
}
