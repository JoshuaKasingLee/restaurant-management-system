import * as React from 'react';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import BalanceRoundedIcon from '@mui/icons-material/BalanceRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import QuantityButtonGroup from './QuantityButtonGroup';
import PaymentDishSelection from './PaymentDishSelection';

function PaymentToggleButton({ submit, order }) {
  const [type, setType] = React.useState('together');  
  const [quantity, setQuantity] = React.useState(4);

  const handlePaymentType = (event, newType) => {
    setType(newType);
    submit(newType);
  };

  React.useEffect(() => {
    localStorage.setItem('paymentType', 'together');
    localStorage.setItem('numSplit', 4);
  }, []);

  return (
    <>
      <ToggleButtonGroup
        size="large"
        value={type}
        exclusive
        onChange={handlePaymentType}
        aria-label="payment method"
      >
        <ToggleButton color="primary" value="together" aria-label="pay together">
          <GroupsRoundedIcon />
          Pay together
        </ToggleButton>
        <ToggleButton color="primary" value="equal" aria-label="split equally">
          <BalanceRoundedIcon />
          Split equally
        </ToggleButton>
        <ToggleButton color="primary" value="dish" aria-label="split by dish">
          <RestaurantRoundedIcon />
          Split by dish
        </ToggleButton>
      </ToggleButtonGroup>
      { type !== 'together' && 
        <div>
          <br />
          <Typography gutterBottom>
            How many people are you splitting between?
          </Typography>
          <QuantityButtonGroup 
            initial={4}
            min={2}
            max={4} 
            submit = { quantity => {
              localStorage.setItem('numSplit', quantity);
              setQuantity(quantity);
            }}
          />
        </ div>
      }
      <br />
      { type === 'dish' &&
        <PaymentDishSelection people={Array(quantity).fill(0)} order={order}/>
      }
    </ >
  );
}

export default PaymentToggleButton;