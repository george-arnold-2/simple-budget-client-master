import React, { useContext } from 'react';
import './Delete.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import config from '../config';
import BudgetContext from '../BudgetContext';
import TokenService from '../token-service';

interface DeleteCategoryProps {
  id: number;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ id }) => {
  const { deleteCategory } = useContext(BudgetContext);

  const handleDeleteCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const categoryId = id;
    fetch(`${config.API_ENDPOINT}/categories/${categoryId}`, {
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
        deleteCategory(categoryId);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  return (
    <div>
      <button className="Trash" onClick={handleDeleteCategory}>
        <FontAwesomeIcon className="Font-Icon-Trash" icon={faTrashAlt} />
      </button>
    </div>
  );
};

export default DeleteCategory;
