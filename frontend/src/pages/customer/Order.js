import * as React from 'react';
import Header from '../../utilities/Header';
import OrderTable from '../../components/customer/OrderTable';
import Footer from '../../components/customer/Footer';

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
