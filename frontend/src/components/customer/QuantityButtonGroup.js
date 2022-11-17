import * as React from 'react';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

function QuantityButtonGroup({initial, min, max, submit}) {
  const [quantity, setQuantity] = React.useState(initial);

  const handleSubtract = () => {
		submit(Math.max(min, quantity - 1));
		setQuantity( state => Math.max(min, state - 1));
  };

  const handleAdd = () => {
		submit(Math.min(max, quantity + 1));
		setQuantity( state => Math.min(max, state + 1));
  };

  return (
		<ButtonGroup variant="outlined">
			<Button sx={{ width: 50 }} onClick={handleSubtract} disabled={quantity === min}>
				<Typography variant="h4">
					-
				</Typography>
			</Button>
			<Box 
				display="flex" 
				sx={{ border: 1, width: 50, textAlign: 'center' }} 
				justifyContent="center" 
				alignItems="center"
			>
				<Typography variant="h4">
					{JSON.stringify(quantity)}
				</Typography>
			</Box>
			<Button sx={{ width: 50 }} onClick={handleAdd} disabled={quantity === max}>
				<Typography variant="h4">
					+
				</Typography>
			</Button>
		</ButtonGroup>
  );
}

export default QuantityButtonGroup;