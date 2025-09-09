import React from 'react';
import { BudgetContextType } from './types';

export default React.createContext<BudgetContextType>({
  demo: false,
  categories: [],
  transactions: [],
  addTransaction: () => {},
  addCategory: () => {},
  deleteTransaction: () => {},
  deleteCategory: () => {},
  totalCost: 0
});
