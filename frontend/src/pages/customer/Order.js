import * as React from 'react';
import Header from '../../components/customer/Header';
import OrderTable from '../../components/customer/OrderTable';
import Footer from '../../components/customer/Footer';

function Order() {
  const [order, setOrder] = React.useState([]);

  React.useEffect(() => {
    const getOrder = async () => {
      const response = await fetch(`http://localhost:5000/customer/order?table=${localStorage.getItem('table')}`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('order', data);
        setOrder(order => data);
        //setOrder({'orderItems': []});
      } else {
        alert(await data.error);
      }
    };
    getOrder();
  }, []);

  return (
    <>
      <Header title={"Orderlist"} />
      <OrderTable />
      {/* <OrderTable order={order} /> */}
      <Footer initialValue={"order"} />
    </ >
  );
}

export default Order;
