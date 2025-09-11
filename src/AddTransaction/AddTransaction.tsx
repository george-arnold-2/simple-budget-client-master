import React, { useState, useContext } from 'react';
import './AddTransaction.css';
import BudgetContext from '../BudgetContext';
import config from '../config';
import TokenService from '../token-service';
import { FormErrors } from '../types';

interface AddTransactionProps {
  onRouteChange: (route: string) => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onRouteChange }) => {
  const [venue, setVenue] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const context = useContext(BudgetContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let valid = true;
    const newErrors: FormErrors = {};

    if (!venue.length) {
      newErrors.venueError = 'Enter Location of Spending';
      valid = false;
    }
    if (!Number(amount) || Number(amount) <= 0) {
      newErrors.amountError = 'Enter amount of $$ spent';
      valid = false;
    }
    if (!Number(categoryId) || Number(categoryId) <= 0) {
      newErrors.categoryIdError = 'Please select a category';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      alert('Please complete the transaction form');
    } else {
      const transaction = {
        venue: venue,
        amount: Number(amount),
        category_id: Number(categoryId),
        user_id: TokenService.getUserId() || undefined,
      };

      fetch(`${config.API_ENDPOINT}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `basic ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify(transaction),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((event) => Promise.reject(event));
          return res.json();
        })
        .then((json) => {
          context.addTransaction(json);
          setVenue('');
          setAmount('');
          setCategoryId('');
          setErrors({});
        })
        .catch((res) => console.log('error:', res));
    }
  };

  const handleVenueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVenue(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.target.value);
  };

  const { categories, transactions } = context;
  const hasCategories = categories.length > 0;

  // Debug logging to see the actual data structure
  console.log('Categories:', categories);
  console.log('Transactions:', transactions);
  if (transactions.length > 0) {
    console.log('First transaction:', transactions[0]);
    console.log('Transaction category_id:', transactions[0].category_id);
    console.log('Transaction categoryId:', transactions[0].categoryId);
  }

  return (
    <div className="Transaction-Page-Container">
      <div className="FormContainer Transaction-Container">
        <div className="Transaction-Header">
          <img
            className="Transaction-Icon"
            alt="money"
            src="https://cdn0.iconfinder.com/data/icons/business-management-line-2/24/cash-512.png"
          />
          <div className="Transaction-Header-Text">
            <h2 className="FormTitle">Add New Transaction</h2>
            <p className="Transaction-Subtitle">Track your spending by adding transactions to your budget</p>
          </div>
        </div>

        <form className="Form" onSubmit={handleSubmit}>
          <div className="Form-Section">
            <h3 className="Form-Section-Title">Transaction Details</h3>

            <div className="Form-Row">
              <div className="Form-Field">
                <label htmlFor="category-selector" className="Category-Select-Label">
                  Category
                </label>
                {hasCategories ? (
                  <select
                    id="category-selector"
                    name="category-selector"
                    className="CategorySelector"
                    value={categoryId}
                    onChange={handleCategoryChange}
                  >
                    <option>Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="No-Categories-Container">
                    <select
                      id="category-selector"
                      name="category-selector"
                      className="CategorySelector Disabled-Select"
                      disabled
                    >
                      <option>No categories available</option>
                    </select>
                    <button
                      type="button"
                      className="Create-Category-Button"
                      onClick={() => onRouteChange('categories')}
                    >
                      Create Categories
                    </button>
                  </div>
                )}
                {errors.categoryIdError && errors.categoryIdError.length > 0 && (
                  <span className="error">{errors.categoryIdError}</span>
                )}
              </div>

              <div className="Form-Field">
                <label className="Transaction-Label" htmlFor="venue">
                  Location/Venue
                </label>
                <input
                  maxLength={50}
                  className="Transaction-Input"
                  id="venue"
                  type="text"
                  placeholder="e.g., Safeway, Amazon, Gas Station"
                  name="venue"
                  value={venue}
                  onChange={handleVenueChange}
                />
                {errors.venueError && errors.venueError.length > 0 && (
                  <span className="error">{errors.venueError}</span>
                )}
              </div>
            </div>

            <div className="Form-Row">
              <div className="Form-Field Amount-Field">
                <label className="Transaction-Label" htmlFor="amount">
                  Amount Spent
                </label>
                <div className="Amount-Input-Container">
                  <span className="Currency-Symbol">$</span>
                  <input
                    id="amount"
                    placeholder="0.00"
                    className="Transaction-Input Amount-Input"
                    type="number"
                    step="0.01"
                    min="0"
                    name="amount"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                {errors.amountError && errors.amountError.length > 0 && (
                  <span className="error">{errors.amountError}</span>
                )}
              </div>
            </div>

            <div className="Form-Actions">
              <input className="Submit Submit-Category" type="submit" value="Add Transaction" />
              <button
                type="button"
                className="Submit Submit-Secondary"
                onClick={() => {
                  setVenue('');
                  setAmount('');
                  setCategoryId('');
                  setErrors({});
                }}
              >
                Clear Form
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="Transaction-Sidebar">
        <div className="Quick-Stats">
          <h3 className="Quick-Stats-Title">Quick Stats</h3>
          <div className="Stat-Item">
            <span className="Stat-Label">Total Transactions:</span>
            <span className="Stat-Value">{context.transactions.length}</span>
          </div>
          <div className="Stat-Item">
            <span className="Stat-Label">Total Spent:</span>
            <span className="Stat-Value">${context.totalCost.toFixed(2)}</span>
          </div>
          <div className="Stat-Item">
            <span className="Stat-Label">Categories:</span>
            <span className="Stat-Value">{context.categories.length}</span>
          </div>
        </div>

        <div className="Recent-Transactions">
          <h3 className="Recent-Transactions-Title">Recent Transactions</h3>
          {context.transactions
            .slice(-5)
            .reverse()
            .map((transaction) => (
              <div key={transaction.id} className="Recent-Transaction-Item">
                <div className="Transaction-Info">
                  <span className="Transaction-Venue">{transaction.venue}</span>
                  <span className="Transaction-Category">
                    {context.categories.find(
                      (cat) =>
                        cat.id === transaction.category_id ||
                        cat.id === transaction.categoryId ||
                        cat.id === Number(transaction.category_id) ||
                        cat.id === Number(transaction.categoryId),
                    )?.name || 'Unknown'}
                  </span>
                </div>
                <span className="Transaction-Amount">${Number(transaction.amount).toFixed(2)}</span>
              </div>
            ))}
          {context.transactions.length === 0 && (
            <p className="No-Transactions">No transactions yet. Add your first one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
