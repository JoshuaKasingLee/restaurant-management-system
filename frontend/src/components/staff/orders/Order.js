import * as React from 'react';
import { TableRow, TableCell } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import Popup from '../../../utilities/Popup';
import useAlert from '../../../utilities/useAlert';

export default function Order({order, nextStatus, role}) {
  const [loading, setLoading] = React.useState(false);
  const { setAlert } = useAlert();

  const [ open, setOpen ] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  async function progressOrderStatus() {
    setLoading(true);
    const response = await fetch(`http://localhost:5000/${role}/orders`, {  
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id: order.id,
        status: nextStatus
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
      <TableCell >{order.table}</TableCell>
      <TableCell >{order.name}</TableCell>
      <TableCell >{order.time_ordered.substring(10)}</TableCell>
      <TableCell sx={{ width: 5 }} align="center">
        <LoadingButton
          variant='contained'
          size='small'
          loading={loading}
          onClick={progressOrderStatus}
          sx={{ mr: 3 }}
          endIcon={<KeyboardDoubleArrowRightRoundedIcon/>}
        >
          {nextStatus}
        </LoadingButton>
      </TableCell>
    </TableRow>
    <Popup
        type="success"
        open={open}
        handleClose={handleClose}
        message={"Success: Food item moved to \"" + nextStatus + "\""}
      />
  </>
  )
}