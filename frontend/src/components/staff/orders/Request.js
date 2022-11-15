import * as React from 'react';
import { TableRow, TableCell } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Popup from '../../../utilities/Popup';
import useAlert from '../../../utilities/useAlert';

export default function Request({table}) {
	const [loading, setLoading] = React.useState(false);
	const { setAlert } = useAlert();

	const [ open, setOpen ] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

	async function resolveRequest() {
		setLoading(true);
		const response = await fetch(`http://localhost:5000/waiter/assist`, {  
			method: 'PUT',
			headers: {
				'Content-type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				table: table
			})
		});
		const data = await response.json();
		if (response.ok) {
			setOpen(true);
			setLoading(false);
		} else {
			setAlert(await data.error);
			setLoading(false);
		}
	}

	return ( <>
		<TableRow
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
		>
			<TableCell >{table}</TableCell>
			<TableCell sx={{ width: 5 }} align="center">
				<LoadingButton
					variant='contained'
					loading={loading}
					size='small'
					onClick={resolveRequest}
					sx={{ mr: 3 }}
				>
					Resolved
				</LoadingButton>
			</TableCell>
		</TableRow>
		<Popup
        type="success"
        open={open}
        handleClose={handleClose}
        message="Success: Request for assistance resolved"
      />
	</>
	)
}