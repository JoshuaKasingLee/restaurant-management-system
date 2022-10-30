import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import QuantityButtonGroup from './QuantityButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

function PaymentToggleButton({ submit }) {
  const [type, setType] = React.useState('together');  

  const handlePaymentType = (event, newType) => {
    setType(newType);
    submit(newType);
  };

  React.useEffect(() => {
    localStorage.setItem('paymentType', 'together');
    localStorage.setItem('numSplit', 4);
  }, []);

  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          justifyContent: 'space-between'
        }}
      >
        <StyledToggleButtonGroup
          size="large"
          value={type}
          exclusive
          onChange={handlePaymentType}
          aria-label="payment method"
        >
          <ToggleButton value="together" aria-label="pay together">
            <FormatAlignLeftIcon />
            Pay together
          </ToggleButton>
          <ToggleButton value="equal" aria-label="split equally">
            <FormatAlignCenterIcon />
            Split equally
          </ToggleButton>
          <ToggleButton value="dish" aria-label="split by dish">
            <FormatAlignRightIcon />
            Split by dish
          </ToggleButton>
        </StyledToggleButtonGroup>
      </Paper>
      <br />
      { type !== 'together' && 
        <div>
          <Typography gutterBottom>
            How many people are you splitting between?
          </Typography>
          <QuantityButtonGroup 
            initial={4}
            min={2}
            max={4} 
            submit = { quantity => localStorage.setItem('numSplit', quantity) }
          />
        </ div>
      }
    </div>
  );
}

export default PaymentToggleButton;