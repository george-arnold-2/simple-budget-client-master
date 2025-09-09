import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation/Navigation';
import AddTransaction from './AddTransaction/AddTransaction';
import SpendingTracker from './SpendingTracker/SpendingTracker';
import BudgetContext from './BudgetContext';
import Signin from './Signin/Signin';
import Register from './Signin/Register';
import { Link } from 'react-router-dom';
import './App.css';
import AddCategories from './AddCategory/AddCategories';
import ParticleConfig from './ParticleConfig';
import TokenService from './token-service';
import { Transaction, Category } from './types';

interface AppState {
  route: string;
  signedIn: boolean;
  categories: Category[];
  transactions: Transaction[];
  demo: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    route: 'signup',
    signedIn: false,
    categories: [],
    transactions: [],
    demo: false,
  });

  useEffect(() => {
    //look at local storage, see if logged in, set signedIn=true,
    // if idle log out
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setState((prevState) => ({
      ...prevState,
      transactions: [...prevState.transactions, transaction],
    }));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setState((prevState) => ({
      ...prevState,
      categories: [...prevState.categories, category],
    }));
  }, []);

  const deleteTransaction = useCallback((transactionId: number) => {
    setState((prevState) => ({
      ...prevState,
      transactions: prevState.transactions.filter((transaction) => transaction.id !== transactionId),
    }));
  }, []);

  const deleteCategory = useCallback((categoryId: number) => {
    setState((prevState) => ({
      ...prevState,
      categories: prevState.categories.filter((category) => category.id !== categoryId),
    }));
  }, []);

  //handles signin & logout to execute necessary actions
  const onRouteChange = useCallback((route: string) => {
    if (route === 'signout') {
      setState((prevState) => ({
        ...prevState,
        signedIn: false,
        transactions: [],
        categories: [],
      }));
      TokenService.clearAuthToken();
    } else if (route === 'home') {
      setState((prevState) => ({
        ...prevState,
        signedIn: true,
      }));
    }
    setState((prevState) => ({
      ...prevState,
      route: route,
    }));
  }, []);

  //sets whether or not the app is in demo-mode
  const setDemo = useCallback((value: boolean) => {
    setState((prevState) => ({
      ...prevState,
      demo: value,
      transactions: [
        { id: 1, venue: 'Safeway', amount: 100.53, categoryId: 2 },
        { id: 2, venue: 'Giant', amount: 140.32, categoryId: 2 },
        { id: 3, venue: 'Pepco', amount: 90.22, categoryId: 1 },
        { id: 4, venue: 'Midtown Tavern', amount: 47.34, categoryId: 3 },
      ],
      categories: [
        {
          id: 1,
          name: 'Bills',
        },
        {
          id: 2,
          name: 'Groceries',
        },
        { id: 3, name: 'Fun' },
      ],
    }));
  }, []);

  const value = {
    demo: state.demo,
    categories: state.categories,
    transactions: state.transactions,
    addTransaction,
    addCategory,
    deleteTransaction,
    deleteCategory,
    totalCost: state.transactions
      .map((transaction) => parseFloat(transaction.amount.toString()))
      .reduce((a, b) => a + b, 0),
  };

  const { signedIn, route } = state;

  return (
    <BudgetContext.Provider value={value}>
      <main className="App">
        <Navigation signedIn={signedIn} route={route} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <div className="App-Container">
            <div className="Container">
              <Link className="Link" to="/">
                Add Expenses
              </Link>
              <Link className="Link" to="/track">
                Spending Tracker
              </Link>
            </div>
            <div className="Category-Transaction-Container">
              <AddCategories />
              <AddTransaction />
            </div>
            <SpendingTracker />
          </div>
        ) : route === 'signup' ? (
          <div>
            <ParticleConfig />
            <Signin setDemo={setDemo} loadUser={() => {}} onRouteChange={onRouteChange} />
          </div>
        ) : (
          <div>
            <ParticleConfig />
            <Register loadUser={() => {}} onRouteChange={onRouteChange} />
          </div>
        )}
      </main>
    </BudgetContext.Provider>
  );
};

export default App;
