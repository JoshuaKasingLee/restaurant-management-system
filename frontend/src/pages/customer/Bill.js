import * as React from 'react';
import Header from '../../components/customer/Header';
import Footer from '../../components/customer/Footer';
import Typography from '@mui/material/Typography';

function Bill() {
  return (
    <>
      <Header title={"Bill"} />
      <Typography align='center' variant="h3">
        Thank you for dining with us!
      </Typography>
      <Typography align='center' variant="h6">
        {/* fix this */}
        Total Charge: ${localStorage.getItem('charge')}
      </Typography>
      <Footer initialValue={"order"} title={"Bill"} />
    </ >
  );
}

export default Bill;