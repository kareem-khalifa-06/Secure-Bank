import { Injectable } from "@angular/core";
import { Role, User } from "../../models/user";
import { HttpClient } from "@angular/common/http";

import { map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private base_url = "https://secure-bank-production-f90d.up.railway.app/";

  constructor(private _HttpClient: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this._HttpClient.get<User[]>(this.base_url + "User");
  }

  getUserById(id: string): Observable<User> {
    return this._HttpClient.get<User>(this.base_url + `User/${id}`);
  }
  updateUser(user: User, id: string): Observable<User> {
    return this._HttpClient.put<User>(this.base_url + `User/${id}`, user);
  }
  deleteUser(id: string): Observable<User> {
    return this._HttpClient.delete<User>(this.base_url + `User/${id}`);
  }
  addUser(user: User): Observable<User> {
    return this._HttpClient.post<User>(this.base_url + "User", user);
  }
}
