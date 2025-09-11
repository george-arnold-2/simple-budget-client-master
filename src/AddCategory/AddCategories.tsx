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
      user_id: TokenService.getUserId() || undefined,
    };

    const token = TokenService.getAuthToken(); // Get the stored token

    if (category.name.length > 0) {
      fetch(`${config.API_ENDPOINT}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `basic ${token}`,
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
    <div className="Category-Page-Container">
      <main className="FormContainer Category-Container">
        <div className="Category-Header">
          <img
            className="Category-Icon"
            alt="entry chart"
            src="https://cdn2.iconfinder.com/data/icons/business-management-158/32/05.Pie_curve-512.png"
          />
          <div className="Category-Header-Text">
            <h2 className="FormTitle">Manage Categories</h2>
            <p className="Category-Subtitle">Organize your spending by creating and managing expense categories</p>
          </div>
        </div>

        <form className="Form" onSubmit={handleSubmit}>
          <div className="Form-Section">
            <h3 className="Form-Section-Title">Add New Category</h3>
            <div className="Form-Row">
              <div className="Form-Field">
                <label className="Category-Entry-Label" htmlFor="Category-Input">
                  Category Name
                </label>
                <input
                  className="Form-Input Category-Input"
                  maxLength={50}
                  type="text"
                  name="Category-Input"
                  id="Category-Input"
                  placeholder="e.g., Groceries, Entertainment, Bills..."
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
            </div>
            <div className="Form-Actions">
              <input className="Submit Submit-Category" type="submit" value="Add Category" />
              <button type="button" className="Submit Submit-Secondary" onClick={() => setName('')}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </main>

      <div className="Category-Sidebar">
        <div className="Category-Stats">
          <h3 className="Category-Stats-Title">Category Overview</h3>
          <div className="Stat-Item">
            <span className="Stat-Label">Total Categories:</span>
            <span className="Stat-Value">{context.categories.length}</span>
          </div>
          <div className="Stat-Item">
            <span className="Stat-Label">Active Categories:</span>
            <span className="Stat-Value">
              {
                context.categories.filter((cat) => context.transactions.some((trans) => trans.category_id === cat.id))
                  .length
              }
            </span>
          </div>
        </div>

        <div className="Category-List">
          <h3 className="Category-List-Title">Your Categories</h3>
          {context.categories.length > 0 ? (
            <div className="Category-Items">
              {context.categories.map((category) => {
                const categoryTransactions = context.transactions.filter(
                  (trans) =>
                    trans.category_id === category.id ||
                    trans.categoryId === category.id ||
                    Number(trans.category_id) === category.id ||
                    Number(trans.categoryId) === category.id,
                );
                const totalSpent = categoryTransactions.reduce((sum, trans) => sum + Number(trans.amount), 0);

                return (
                  <div key={category.id} className="Category-Item">
                    <div className="Category-Info">
                      <span className="Category-Name">{category.name}</span>
                      <span className="Category-Transaction-Count">
                        {categoryTransactions.length} transaction{categoryTransactions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="Category-Amount">${totalSpent.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="No-Categories">No categories yet. Create your first one above!</p>
          )}
        </div>

        <div className="Category-Tips">
          <h3 className="Category-Tips-Title">💡 Tips for Better Categories</h3>
          <ul className="Tips-List">
            <li>Use specific names like "Grocery Shopping" instead of "Food"</li>
            <li>Create categories for different types of bills</li>
            <li>Consider seasonal categories like "Holiday Shopping"</li>
            <li>Group similar expenses together</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
