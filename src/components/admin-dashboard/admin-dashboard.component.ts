import { User } from './../../models/user';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  editUserData: User | null = null;
  editUserForm!:FormGroup;
  addUserForm!:FormGroup;
  showEditFrom=false;
showAddFrom=false;
usersData!:User[];
constructor(public _UserService:UserService,
  private formBuilder:FormBuilder,private _AccountService:AccountService
){
  this.initializeForms();
  
}
activeUsers:User[]=[];
inActiveUsers:User[]=[];
admins:User[]=[];
ngOnInit(): void {
  this.loadUsers();
}

loadUsers(): void {
  this._UserService.getAllUsers().subscribe({
    next: (res) => {
      this.usersData = res;
      this.activeUsers=res.filter((u)=>u.isActive);
      this.inActiveUsers=res.filter((u)=>u.isActive===false);
      this.admins=res.filter((u)=>u.role==='Admin');
    },
    error: (err) => console.error('Failed to load users:', err)
  });
}

editUser() {
  if (this.editUserForm.valid && this.editUserData) {
    const formValue = this.editUserForm.value;
    const id = this.editUserData.id;
    const updatedUser: User = { ...this.editUserData, ...formValue };

    this._UserService.updateUser(updatedUser, id).subscribe({
      next: () => {
        this.showEditFrom = false;
        this.editUserForm.reset();
        this.loadUsers(); 
      }
    });
  }
}



deleteUser(id: number): void {
  if (confirm('Are you sure you want to delete this user?')) {
    this._UserService.deleteUser(id).subscribe({
      next: () => this.loadUsers() 
    });
    this._AccountService.deleteUser(id).subscribe({
      next:()=>{
        this.loadUsers();
      }
    })
  }
}

toggleUserStatus(i:number):void{
  this.usersData[i].isActive=!this.usersData[i].isActive;
  }

initializeForms() {
  this.addUserForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^\\+[0-9]{11}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['User', [Validators.required]]
  });

  this.editUserForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^\\+[0-9]{11}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['User', [Validators.required]]
  });
}
showEditdata(i:number):void{
  this.editUserForm = this.formBuilder.group({
    username: [this.usersData[i].username, [Validators.required, Validators.minLength(3)]],
    email: [this.usersData[i].email, [Validators.required, Validators.email]],
    phone: [this.usersData[i].phone, [Validators.required, Validators.pattern('^\\+[0-9]{11}$')]],
    password: [this.usersData[i].password, [Validators.required, Validators.minLength(6)]],
    role: [this.usersData[i].role, [Validators.required]]
  });
  this.editUserData=this.usersData[i];
}
addNewUser() {
  console.log(this.addUserForm.valid);
  if (this.addUserForm.valid) {
    const formValue = this.addUserForm.value;
  const id=this.usersData.length;
    const newUser: User = {
      id:id,
      username: formValue.username,
      password: formValue.password,
      role: formValue.role,
      isActive: true,
      email: formValue.email,
      phone: formValue.phone
    };

    this._UserService.addUser(newUser).subscribe({
      next: () => {
        this.showAddFrom = false;
        this.addUserForm.reset();
        this.loadUsers(); 
      },
      error: (err) => console.error('Failed to add user:', err)
    });
  }
  else{
    alert('invalid Form');
  }
}

}


