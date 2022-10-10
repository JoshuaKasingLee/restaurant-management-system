import * as React from 'react';
import Header from '../../components/customer/Header';
import OrderTable from '../../components/customer/OrderTable';
import Footer from '../../components/customer/Footer';

function Order() {
  return (
    <>
      <Header title={"Orderlist"} />
      <OrderTable submit = {async () => {
        const response = await fetch('http://localhost:5000/customer/bill', {
          method: 'POST',
          mode: 'cors',
          headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(
            { 
              table: localStorage.getItem('table'),
              type: 'together',
              num: 4,
              dishes: {
                person1: [],
                person2: [],
                person3: [],
                person4: [],
              }
            }
          )
        });
        const data = await response.json();
        if (response.ok) {
          // console.log(data);
          localStorage.setItem('charge', data.charge[0]);
          console.log(localStorage.getItem('charge'));
        } else {
          alert(await data.error);
        }
      }} />
      <Footer initialValue={"order"} />
    </ >
  );
}

export default Order;
