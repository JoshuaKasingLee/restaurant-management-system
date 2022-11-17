import * as React from 'react';
import TableForm from '../../components/customer/TableForm';
import Header from '../../utilities/Header';
import useAlert from '../../utilities/useAlert';

function Table () {  
  const { setAlert } = useAlert();

	return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Table Selection"}
        heading={null}
      />
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
          localStorage.setItem('assistance', false);
          localStorage.setItem('token', data.token);
        } else {
          setAlert(await data.error);
        }
      }} 
      />
    </ >
	);
}
  
export default Table;