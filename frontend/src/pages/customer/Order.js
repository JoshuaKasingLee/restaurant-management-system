import * as React from 'react';
import OrderTable from '../../components/customer/order/OrderTable';
import Footer from '../../components/customer/Footer';
import Header from '../../utilities/Header';

function Order() {
  return (
    <>
      <Header
        image={localStorage.getItem('restaurantImage')}
        title={"Orders"}
        heading={"Table " + localStorage.getItem('table')}
      />
      <OrderTable />
      <Footer initialValue={"order"} />
    </ >
  );
}

export default Order;
