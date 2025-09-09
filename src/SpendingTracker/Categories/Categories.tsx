import React, { useContext, useEffect } from 'react';
import './Categories.css';
import BudgetContext from '../../BudgetContext';
import config from '../../config';
import TokenService from '../../token-service';
import DeleteTransaction from '../../Delete/DeleteTransaction';
import DeleteCategory from '../../Delete/DeleteCategory';
import { Category, Transaction } from '../../types';

interface CategoryWithTotal extends Category {
  total: number;
}

const Categories: React.FC = () => {
  const { categories = [], transactions = [], addCategory, addTransaction, demo } = useContext(BudgetContext);

  useEffect(() => {
    if (categories.length === 0) {
      Promise.all([
        fetch(`${config.API_ENDPOINT}/categories`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            authorization: `basic ${TokenService.getAuthToken()}`,
          },
        }),
        fetch(`${config.API_ENDPOINT}/transactions`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            authorization: `basic ${TokenService.getAuthToken()}`,
          },
        }),
      ])
        .then(([categoriesRes, transactionsRes]) => {
          if (!categoriesRes.ok) return categoriesRes.json().then((event) => Promise.reject(event));
          if (!transactionsRes.ok) return transactionsRes.json().then((event) => Promise.reject(event));
          return Promise.all([categoriesRes.json(), transactionsRes.json()]);
        })
        .then(([categoriesData, transactionsData]) => {
          //does not pull data from db if in demo mode
          if (!demo) {
            categoriesData.forEach((category: Category) => addCategory(category));
            transactionsData.forEach((transaction: Transaction) => addTransaction(transaction));
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [categories.length, addCategory, addTransaction, demo]);

  // Calculate totals for each category
  const categoriesWithTotals: CategoryWithTotal[] = categories.map((category) => {
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
    <main className="Categories-Display">
      {categoriesWithTotals.map((category) => (
        <ul key={category.id} className="CategoriesList">
          <li className="CategoriesListItem" key={category.id}>
            <DeleteCategory id={category.id} />
            <span className="Category-Name">{category.name}</span>{' '}
            <span className="Category-Total">${category.total}</span>
            <ul className="TransactionList">
              {transactions
                .filter((transaction) => transaction.categoryId === category.id)
                .map((transaction) => (
                  <li className="Transaction-List-Item" key={transaction.id}>
                    <span className="Transaction-Span-1">
                      <DeleteTransaction id={transaction.id} />
                      {transaction.venue}:
                    </span>{' '}
                    <span>${transaction.amount}</span>
                  </li>
                ))}
            </ul>
          </li>
        </ul>
      ))}
    </main>
  );
};

export default Categories;
