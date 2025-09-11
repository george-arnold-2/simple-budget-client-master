import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation/Navigation';
import AddTransaction from './AddTransaction/AddTransaction';
import SpendingTracker from './SpendingTracker/SpendingTracker';
import BudgetContext from './BudgetContext';
import Signin from './Signin/Signin';
import Register from './Signin/Register';
import './App.css';
import AddCategories from './AddCategory/AddCategories';
import InfoCards from './Signin/InfoCards';

import TokenService from './token-service';
import config from './config';
import { Transaction, Category } from './types';

interface AppState {
  route: string;
  signedIn: boolean;
  categories: Category[];
  transactions: Transaction[];
  demo: boolean;
  loading: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    route: 'signup',
    signedIn: false,
    categories: [],
    transactions: [],
    demo: false,
    loading: true,
  });

  useEffect(() => {
    // Check if user is already logged in by looking at localStorage
    const hasToken = TokenService.hasAuthToken();
    if (hasToken) {
      setState((prevState) => ({
        ...prevState,
        signedIn: true,
        route: 'home',
      }));

      // Load user data from API
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
          setState((prevState) => ({
            ...prevState,
            categories: categoriesData,
            transactions: transactionsData,
            loading: false,
          }));
        })
        .catch((error) => {
          console.error('Error loading user data:', error);
          // If there's an error loading data, the token might be invalid
          // Clear the token and redirect to signin
          TokenService.clearAuthToken();
          setState((prevState) => ({
            ...prevState,
            signedIn: false,
            route: 'signup',
            loading: false,
          }));
        });
    } else {
      // No token, set loading to false
      setState((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
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
      TokenService.clearUserId();
    } else if (route === 'home' || route === 'categories' || route === 'track') {
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

  const { signedIn, route, loading } = state;

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <BudgetContext.Provider value={value}>
      <main className="App">
        <Navigation signedIn={signedIn} route={route} onRouteChange={onRouteChange} />
        {route === 'home' ? (
          <div className="App-Container">
            <div className="Category-Transaction-Container">
              <AddTransaction onRouteChange={onRouteChange} />
            </div>
          </div>
        ) : route === 'categories' ? (
          <div className="App-Container">
            <div className="Category-Transaction-Container">
              <AddCategories />
            </div>
          </div>
        ) : route === 'track' ? (
          <div className="App-Container">
            <div className="Category-Transaction-Container">
              <SpendingTracker />
            </div>
          </div>
        ) : route === 'signup' ? (
          <div>
            <Signin setDemo={setDemo} loadUser={() => {}} onRouteChange={onRouteChange} />
            <InfoCards />
          </div>
        ) : (
          <div>
            <Register loadUser={() => {}} onRouteChange={onRouteChange} setDemo={setDemo} />
            <InfoCards />
          </div>
        )}
      </main>
    </BudgetContext.Provider>
  );
};

export default App;
