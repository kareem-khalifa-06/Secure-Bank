
  export  interface Transaction {

        id: string;
      
        fromAccountNo: string;
      
        ToAccountNo: string;
      
        date: string;
      
        amount: number;
      
        type: 'debit' | 'credit';
      
        description: string;
      
      }

