import * as React from 'react';
import BudgetForm from '../../components/customer/BudgetForm';
import Header from '../../components/customer/Header';
import useAlert from '../../utilities/useAlert';

function Budget () {
  const { setAlert } = useAlert();

	return (
    <>
      <Header image={localStorage.getItem('restaurantImage')} title={"Budget Allocation"}/>
      <BudgetForm submit = {async (budget) => {
        if (budget !== '') {
          const response = await fetch('http://localhost:5000/customer/budget', {
            method: 'PUT',
            mode: 'cors',
            headers: {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(
              { 
                table: localStorage.getItem('table'),
                budget: parseFloat(budget)
              }
            )
          });
          const data = await response.json();
          if (response.ok) {
          } else {
            setAlert(await data.error);
          }
        }
      }} 
      />
    </ >
	);
}
  
export default Budget;