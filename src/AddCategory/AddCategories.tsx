import React, { useState, useContext } from 'react';
import './AddCategories.css';
import BudgetContext from '../BudgetContext';
import config from '../config';
import TokenService from '../token-service';
import { Category } from '../types';

const AddCategories: React.FC = () => {
  const [name, setName] = useState<string>('');
  const context = useContext(BudgetContext);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const category: Omit<Category, 'id'> = {
      name: name,
    };

    if (category.name.length > 0) {
      fetch(`${config.API_ENDPOINT}/categories`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          Authorization: `basic ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify(category),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((event) => Promise.reject(event));
          return res.json();
        })
        .then((json: Category) => {
          context.addCategory(json);
          //clear the form
          setName('');
        })
        .catch((error) => {
          console.error({ error });
        });
    } else {
      alert('Please enter a name for the category');
    }
  };

  return (
    <main className="FormContainer Category-Container">
      <img
        className="Landing-Page-Icon App-Icon"
        alt="entry chart"
        src="https://cdn2.iconfinder.com/data/icons/business-management-158/32/05.Pie_curve-512.png"
      />
      <form className="Form" onSubmit={handleSubmit}>
        <h2 className="FormTitle">Category Entry</h2>
        <label className="Category-Entry-Label" htmlFor="Category-Input">
          Enter a category name
        </label>
        <input
          className="Form-Input Category-Input"
          maxLength={50}
          type="text"
          name="Category-Input"
          id="Category-Input"
          placeholder="Bills, etc..."
          value={name}
          onChange={handleNameChange}
        />
        <input className="Submit Submit-Category" type="submit" value="Add Category" />
      </form>
      <div className="Text-On-Screens-Over-1024px">
        <h3 className="Landing-Page-Heading">Step 1: Set up your categories</h3>
        <p>By categorizing your expenses you can easily see where you are over-spending</p>
        <h3 className="Landing-Page-Heading">Step 2: Add Transactions</h3>
        <p>
          Either each time you spend money, or by taking 2 minutes a day, upload your any financial transaction that you
          want to track
        </p>
        <h3 className="Landing-Page-Heading">Step 3: Enjoy your savings!</h3>
        <p>Make a daily routine out of checking your budget, and you'll learn to save!</p>
      </div>
    </main>
  );
};

export default AddCategories;
