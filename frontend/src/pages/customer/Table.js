import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import TableForm from '../../components/customer/TableForm';
import Header from '../../components/customer/Header';

function Table () {
  localStorage.clear();
  const navigate = useNavigate();
	
	return (
    <>
      <Header title={"Table Selection"}/>
      <TableForm submit = {async (table) => {
        const response = await fetch('http://localhost:5005/customer/table', {
          method: 'POST',
          headers: {
          'Content-type': 'application/json',
          },
          body: JSON.stringify({table})
        });
        const data = await response.json();
        if (response.ok) {
          // store token/table number backend/local storage on submit
          localStorage.setItem('token', data.token);
          navigate('/menu');
        } else {
          alert(await data.error);
        }
        }} 
      />
    </ >
	);
}
  
export default Table;