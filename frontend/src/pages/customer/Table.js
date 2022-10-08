import * as React from 'react';
import TableForm from '../../components/customer/TableForm';
import Header from '../../components/customer/Header';

function Table () {
  localStorage.clear();
	
	return (
    <>
      <Header title={"Table Selection"}/>
      <TableForm submit = {async (table) => {
        const response = await fetch('http://localhost:5000/customer/table', {
          method: 'POST',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ table: table })
        });
        const data = await response.json();
        if (response.ok) {
          // console.log(data);
          localStorage.setItem('token', data.token);
        } else {
          alert(await data.error);
        }
        }} 
      />
    </ >
	);
}
  
export default Table;