import * as React from 'react';
import TabForm from '../../components/customer/TabForm';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';

function Tab () {  
	return (
    <>
      <Header image={localStorage.getItem('restaurantImage')} title={"Budget Allocation"}/>
      <TabForm submit = {async (budget) => {
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
            alert(await data.error);
          }
        }
      }} 
      />
      <Footer title = 'Budget Allocation' />
    </ >
	);
}
  
export default Tab;