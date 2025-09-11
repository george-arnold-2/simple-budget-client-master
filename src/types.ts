export interface Transaction {
  id: number;
  venue: string;
  amount: number;
  category_id?: number;
  categoryId?: number;
  user_id?: string | number;
}

export interface Category {
  id: number;
  name: string;
  user_id?: string | number;
}

export interface BudgetContextType {
  demo: boolean;
  categories: Category[];
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  addCategory: (category: Category) => void;
  deleteTransaction: (transactionId: number) => void;
  deleteCategory: (categoryId: number) => void;
  totalCost: number;
}

export interface FormErrors {
  venueError?: string;
  amountError?: string;
  categoryIdError?: string;
  nameError?: string;
}
