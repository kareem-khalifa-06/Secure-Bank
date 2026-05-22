import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account } from "../../models/account";
import { Observable, map } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private base_url = "https://secure-bank-production-f90d.up.railway.app/";

  constructor(private _HttpClient: HttpClient) {}

  getAllAccounts(): Observable<Account[]> {
    return this._HttpClient.get<Account[]>(this.base_url + "Account");
  }

  getUserAccounts(id: string): Observable<Account[]> {
    return this.getAllAccounts().pipe(
      map((accounts) => accounts.filter((u) => u.userId === id)),
    );
  }

  updateUser(user: Account, id: string): Observable<Account> {
    return this._HttpClient.put<Account>(this.base_url + `Account/${id}`, user);
  }

  deleteUser(id: string): Observable<Account> {
    return this._HttpClient.delete<Account>(this.base_url + `Account/${id}`);
  }
}
