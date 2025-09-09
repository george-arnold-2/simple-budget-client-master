import React, { useContext } from 'react';
import './Delete.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import config from '../config';
import BudgetContext from '../BudgetContext';
import TokenService from '../token-service';

interface DeleteTransactionProps {
  id: number;
}

const DeleteTransaction: React.FC<DeleteTransactionProps> = ({ id }) => {
  const { deleteTransaction } = useContext(BudgetContext);

  const handleDeleteTransaction = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const transactionId = id;
    fetch(`${config.API_ENDPOINT}/transactions/${transactionId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `basic ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then(() => {
        deleteTransaction(transactionId);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  return (
    <div>
      <button className="Trash Transaction-Trash" onClick={handleDeleteTransaction}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  );
};

export default DeleteTransaction;
