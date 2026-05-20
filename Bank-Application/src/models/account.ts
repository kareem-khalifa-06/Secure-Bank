
    export enum AccountType {
        Savings = 'Savings',
        Current = 'Current'
      }
      
      export interface Account {
        id: string;
      
        accountNo: string;
      
        accountType: AccountType;
      
        balance: number;
      
        userId: number;
      }
