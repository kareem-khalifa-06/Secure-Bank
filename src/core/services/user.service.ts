import { Injectable } from '@angular/core';
import { Role, User} from '../../models/user';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

   private base_url = 'http://localhost:3000/';
  
    constructor(private _HttpClient: HttpClient) {}
  
    getAllUsers(): Observable<User[]> {
      return this._HttpClient.get<User[]>(this.base_url + 'User');
    }
  
    getUserById(id: number): Observable<User|undefined> {
      return this.getAllUsers().pipe(
        map(Users => Users.find(u => u.id ===id))
      );
    }
    updateUser(user:User,id:number):Observable<User>{
      return this._HttpClient.put<User>(this.base_url+`User/${id}`,user)
    }
    deleteUser(id:number):Observable<User>{
      return this._HttpClient.delete<User>(this.base_url+`User/${id}`)
    }
    addUser(user: User): Observable<User> {
      return this._HttpClient.post<User>(this.base_url + 'User', user);
    }
    
  
}
