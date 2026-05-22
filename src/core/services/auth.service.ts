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

  // ─── Admin → User View ──────────────────────────
  /** Switch admin to user portal view, preserving original admin session */
  switchToUserView(): void {
    const current = localStorage.getItem('currentUser');
    if (!current) return;

    const parsed = JSON.parse(current);
    if (parsed.role !== 'Admin') return;

    // Save original admin session so we can restore it
    localStorage.setItem('adminSession', current);

    // Override role to User so guard and routing treat them as a user
    localStorage.setItem('currentUser', JSON.stringify({
      ...parsed,
      role: 'User',
    }));

    this._router.navigate(['/user/home']);
  }

  /** Switch back from user view to admin */
  switchBackToAdmin(): void {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) return;

    localStorage.setItem('currentUser', adminSession);
    localStorage.removeItem('adminSession');

    this._router.navigate(['/admin/home']);
  }

  /** True when an admin is currently browsing as a user */
  isAdminViewingAsUser(): boolean {
    return !!localStorage.getItem('adminSession');
  }

  // ─── Helpers ────────────────────────────────────
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
    localStorage.removeItem('adminSession'); // clean up if admin was in user view
    this._router.navigate(['/']);
  }
}