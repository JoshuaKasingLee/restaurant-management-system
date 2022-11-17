import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import useAlert from '../../utilities/useAlert';

function TableForm ({ submit }) {
  const [table, setTable] = React.useState('');
  const [numTables, setNumTables] = React.useState(0);
  const { setAlert } = useAlert();

  const onSubmit = () => {
    submit(table);
    localStorage.setItem('table', table);
  }

  React.useEffect(() => {
    const getNumTables = async () => {
      const response = await fetch(`http://localhost:5000/customer/table`, {  
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        },
      });
      const data = await response.json();
      if (response.ok) {
        setNumTables(data.numTables);
      } else {
        setAlert(await data.error);
      }
    };
    getNumTables();
  }, []);

  const getTableContent = numTables => {
    let content = [];
    for (let i = 1; i <= numTables; i++) {
      content.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }
    return content;
  };
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
    >
			<Stack spacing={2}>
        <Box sx={{ width: '370px'}}>
          <Typography variant="h4" textAlign="center">
            Please select a table number:
          </Typography>
          <br/>
          <FormControl fullWidth>
            <InputLabel id="table-select-label">
              Table
            </InputLabel>
            <Select
              labelId="table-select-label"
              id="table-select"
              value={table}
              label="Table"
              onChange={e => setTable(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224
                  },
                },
              }}
            >
              {getTableContent(numTables)}
            </Select>
          </FormControl>
        </Box>
        <Button 
          component={Link} 
          to={'/customer/budget'} 
          variant="contained" 
          onClick={onSubmit} 
          disabled={table === ''}
        >
          Confirm
        </Button>
      </Stack>
		</Box>
  )
}

TableForm.propTypes = {
  submit: PropTypes.elementType
}

export default TableForm;