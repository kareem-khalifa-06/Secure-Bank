import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnInit } from "@angular/core";
import { Account } from "../../models/account";
import { AccountService } from "../../core/services/account.service";
import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Transaction } from "../../models/transactions";
import { TransactionService } from "../../core/services/transaction.service";

@Component({
  selector: "app-user-transfer",
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: "./user-transfer.component.html",
  styleUrl: "./user-transfer.component.css",
  providers: [DatePipe],
})
export class UserTransferComponent implements OnInit {
  userId!: string;
  nextId: number = 1;
 _ToastrService =inject(ToastrService);
  senderAccounts: Account[] = [];
  reciverAccounts: Account[] = [];

  transferForm: FormGroup = this._FormBuilder.group({
    ToAccountNo: ["", Validators.required],
    fromAccountNo: ["", Validators.required],
    amount: ["", [Validators.required, Validators.min(0.01)]],
    description: [""],
  });

  constructor(
    private _AccountService: AccountService,
    private _FormBuilder: FormBuilder,
    private _TransactionService: TransactionService,
    private _DatePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this._TransactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        if (transactions.length > 0) {
          const maxId = Math.max(...transactions.map((t) => Number(t.id)));
          this.nextId = maxId + 1;
        }
      },
    });

    const user = localStorage.getItem("currentUser");
    if (user) {
      const userData = JSON.parse(user);
      this.userId = userData.userId;
      this.loadSenderAccounts();
    }

    this._AccountService.getAllAccounts().subscribe({
      next: (res) => {
        this.reciverAccounts = res;
      },
    });
  }

  private loadSenderAccounts(): void {
    this._AccountService.getUserAccounts(this.userId).subscribe({
      next: (res) => {
        this.senderAccounts = res ?? [];
        const currentSelection = this.transferForm.get("fromAccountNo")?.value;
        if (!currentSelection && this.senderAccounts.length > 0) {
          this.transferForm
            .get("fromAccountNo")
            ?.setValue(this.senderAccounts[0].accountNo);
        }
      },
    });
  }

  getSelectedSender(): Account | undefined {
    const selectedNo = this.transferForm.get("fromAccountNo")?.value;
    return this.senderAccounts.find((a) => a.accountNo === selectedNo);
  }

  transferFunds(selectedAccount: Account | undefined): void {
    if (!selectedAccount) {
      ("Please select a sender account.");
      return;
    }
    if (this.transferForm.invalid) {
      ("Please fill in all required fields.");
      return;
    }

    // Capture values before any reset
    const { ToAccountNo, fromAccountNo, amount, description } =
      this.transferForm.value;
    const transferAmount = Number(amount);

    if (transferAmount > selectedAccount.balance) {
      this._ToastrService.info("Insufficient balance.");
      return;
    }

    const newTransaction: Transaction = {
      id: this.nextId.toString(),
      ToAccountNo,
      fromAccountNo,
      amount: transferAmount,
      date:
        this._DatePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'") ?? "",
      type: "credit",
      description: description ?? "",
    };

    this._TransactionService.makeNewTransaction(newTransaction).subscribe({
      next: () => {
        this.nextId++;

        // Step 1: debit sender
        const updatedSender: Account = {
          ...selectedAccount,
          balance: selectedAccount.balance - transferAmount,
        };

        this._AccountService
          .updateUser(updatedSender, selectedAccount.id)
          .subscribe({
            next: () => {
              // Step 2: find receiver then credit — chained AFTER sender update completes
              this._AccountService.getAllAccounts().subscribe({
                next: (accounts) => {
                  const receiver = accounts.find(
                    (a) => a.accountNo === ToAccountNo,
                  );
                  if (receiver) {
                    const updatedReceiver: Account = {
                      ...receiver,
                      balance: receiver.balance + transferAmount,
                    };
                    this._AccountService
                      .updateUser(updatedReceiver, receiver.id)
                      .subscribe({
                        next: () => {
                          // Step 3: everything done — refresh UI
                          this.loadSenderAccounts();
                          this._ToastrService.success("Transfer successful!");
                          const previousSelection = fromAccountNo;
                          this.transferForm.reset();
                          this.transferForm
                            .get("fromAccountNo")
                            ?.setValue(previousSelection);
                        },
                        error: (err) =>
                          console.error("Failed to update receiver:", err),
                      });
                  } else {
                    console.error("Receiver account not found:", ToAccountNo);
                    this._ToastrService.error("Transfer failed: recipient account not found.");
                  }
                },
                error: (err) => console.error("Failed to fetch accounts:", err),
              });
            },
            error: (err) => console.error("Failed to update sender:", err),
          });
      },
      error: (err) => console.error("Transaction failed:", err),
    });
  }
}
