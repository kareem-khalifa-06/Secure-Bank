import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Role, User } from '../../models/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _userService: UserService, private _router: Router) {}

  getAllUsers(): Observable<User[]> {
    return this._userService.getAllUsers();
  }

  login(username: string, password: string | number): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((users) => {
        const user = users.find(
          (u) => u.username === username &&
                 u.password === password &&
                 u.isActive
        );

        if (!user) throw new Error('Invalid credentials');

        localStorage.setItem('currentUser', JSON.stringify({
          userId: user.id,
          role: user.role,
          username: user.username,
        }));

        return true;
      })
    );
  }

  getUserName(): string | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data).username : null;
  }

  getRole(): Role | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data).role : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this._router.navigate(['/']);
  }
}