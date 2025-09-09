import React, { useState, useContext } from 'react';
import './AddTransaction.css';
import BudgetContext from '../BudgetContext';
import config from '../config';
import Categories from '../SpendingTracker/Categories/Categories';
import TokenService from '../token-service';
import { FormErrors } from '../types';

const AddTransaction: React.FC = () => {
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
      };

      fetch(`${config.API_ENDPOINT}/transactions`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
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

  const { categories } = context;

  return (
    <main className="FormContainer Transaction-Container">
      <h2 className="FormTitle">Transaction Entry</h2>
      <img
        className="Landing-Page-Icon App-Icon Transaction-Icon"
        alt="money"
        src="https://cdn0.iconfinder.com/data/icons/business-management-line-2/24/cash-512.png"
      />

      <form className="Form" onSubmit={handleSubmit}>
        <label htmlFor="category-selector" className="Category-Select-Label">
          Click below to select a category:
        </label>
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
              {' '}
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryIdError && errors.categoryIdError.length > 0 && (
          <span className="error">{errors.categoryIdError}</span>
        )}
        <label className="Transaction-Label" htmlFor="venue">
          Where did you spend?
        </label>
        <input
          maxLength={50}
          className="Transaction-Input"
          id="venue"
          type="text"
          placeholder="Pepco"
          name="venue"
          value={venue}
          onChange={handleVenueChange}
        />
        {errors.venueError && errors.venueError.length > 0 && <span className="error">{errors.venueError}</span>}
        <label className="Transaction-Label" htmlFor="amount">
          How much did you spend?
        </label>

        <input
          id="amount"
          placeholder="100.23"
          className="Transaction-Input"
          type="number"
          name="amount"
          value={amount}
          onChange={handleAmountChange}
        />
        {errors.amountError && errors.amountError.length > 0 && <span className="error">{errors.amountError}</span>}
        <input className="Submit Submit-Category" type="submit" value="Add Transaction" />
      </form>
      <Categories />
    </main>
  );
};

export default AddTransaction;
