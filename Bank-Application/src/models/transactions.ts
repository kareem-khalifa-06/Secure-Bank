
  export  interface Transaction {

        id: string;
      
        fromAccountNo: string;
      
        ToAccountNo: string;
      
        date: Date;
      
        amount: number;
      
        type: 'debit' | 'credit';
      
        description: string;
      
      }

