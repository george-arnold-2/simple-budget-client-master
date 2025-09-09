import React, { useContext } from 'react';
import './SpendingTracker.css';
import BudgetContext from '../BudgetContext';
import SpendingGraph from './SpendingGraph';

const SpendingTracker: React.FC = () => {
  const { categories, transactions, totalCost } = useContext(BudgetContext);

  // Calculate totals for each category
  const categoriesWithTotals = categories.map((category) => {
    const total = transactions
      .filter((transaction) => transaction.categoryId === category.id)
      .map((transaction) => Number(transaction.amount))
      .reduce((a, b) => a + b, 0);

    return {
      ...category,
      total,
    };
  });

  return (
    <main className="SpendingTracker">
      <h2>Your Spending</h2>
      <p>Total Amount Spent</p>
      <h3>${Math.floor(totalCost * 100) / 100}</h3>
      <div className="Spending-Graph-Container">
        <SpendingGraph categories={categoriesWithTotals} />
      </div>
    </main>
  );
};

export default SpendingTracker;
