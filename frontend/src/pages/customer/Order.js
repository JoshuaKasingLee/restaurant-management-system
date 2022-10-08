import * as React from 'react';
import Header from '../../components/customer/Header';
import OrderTable from '../../components/customer/OrderTable';
import Footer from '../../components/customer/Footer';

function Order() {
  return (
    <>
      <Header title={"Orderlist"} />
      <OrderTable />
      <Footer initialValue={"order"}/>
    </ >
  );
}

export default Order;
