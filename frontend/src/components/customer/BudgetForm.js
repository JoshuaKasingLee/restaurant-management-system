import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, FormHelperText, InputLabel, OutlinedInput, InputAdornment, Stack, Typography } from '@mui/material';

/* Budget Form Component */

function BudgetForm ({ submit }) {
  const [budget, setBudget] = React.useState('');

  const onSubmit = () => {
    submit(budget);
  }
  
  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
      <Stack spacing={2}>
        <Box sx={{ width: '370px', textAlign: "center" }}>
          <Typography variant="h4" >
            Would you like to set a budget? 
          </Typography>
          <Typography>
            If so, please input an amount and we will alert you when you reach it.
          </Typography>
          <br/>
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Budget</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              onChange={e => setBudget(e.target.value)}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              label="Budget"
              value={budget}
              type="number"
              min="0"
              step=".01"
            />
            <FormHelperText id="filled-weight-helper-text">
            Max $1000.00
            </FormHelperText>
          </FormControl>
        </Box>
        <Box  display="flex" justifyContent='space-between'>
          <Button component={Link} to={'/customer/menu'} variant="contained" onClick={onSubmit} sx={{ width: '180px' }}>
            No
          </Button>
          <Button component={Link} to={'/customer/menu'} variant="contained" onClick={onSubmit} disabled={budget === '' || parseFloat(budget) <= 0 || parseFloat(budget) > 1000}  sx={{ width: '180px' }}>
            Yes
          </Button>
        </Box>
      </Stack>
		</Box>
  )
}

BudgetForm.propTypes = {
  submit: PropTypes.elementType
}

export default BudgetForm;
