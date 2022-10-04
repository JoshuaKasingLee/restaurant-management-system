import * as React from 'react';
import { Link } from 'react-router-dom';
import BasicSelect from "../../components/customer/TableDropdown";
import { Box, Button, Stack } from '@mui/material';

function Table () {
	// store table number backend/local storage on submit
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
			<Stack spacing={2}>
				<BasicSelect></BasicSelect>
				<Button component={Link} to={'/customer/menu'} variant="contained">Confirm</Button>
			</Stack>
		</Box>
	);
}
  
export default Table;