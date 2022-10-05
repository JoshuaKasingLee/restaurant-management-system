import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

/* Table Form Component */

function TableForm ({ submit }) {
  const [table, setTable] = React.useState('');
  const [numTables, setNumTables] = React.useState(0);

  const onSubmit = () => {
    submit(table);
    // print out table number
    console.log(table);
    localStorage.setItem('table', table);
  }

  React.useEffect(() => {
    const getNumTables = async () => {
      const response = await fetch(`http://localhost:5000/customer/table`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNumTables(data.numTables);
      } else {
        alert(await data.error);
      }
    };
    getNumTables();
  }, []);

  const getTableContent = numTables => {
    let content = [];
    // 4 for testing, should be numTables
    for (let i = 1; i <= 4; i++) {
      content.push(<MenuItem value={i}>{i}</MenuItem>);
    }
    return content;
  };
  
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
			<Stack spacing={2}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Table</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={table}
              label="Table"
              onChange={e => setTable(e.target.value)}
            >
              {getTableContent(numTables)}
            </Select>
          </FormControl>
        </Box>
				<Button component={Link} to={'/customer/menu'} variant="contained" onClick={onSubmit}>Confirm</Button>
			</Stack>
		</Box>
  )
}

TableForm.propTypes = {
  submit: PropTypes.elementType
}

export default TableForm;
