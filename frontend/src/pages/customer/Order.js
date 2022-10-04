import * as React from 'react';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';

function Order() {
  return (
    <>
      <Header title={"Orderlist"} />
      <Footer initialValue={"order"}/>
    </ >
  );
}

export default Order;
