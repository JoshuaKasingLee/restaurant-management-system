import * as React from 'react';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Typography } from '@mui/material';

export default function PaymentDishelection({ people, order }) {
  const [checked, setChecked] = React.useState(Array.from({length: order.length},() => Array.from({length: people.length}, () => false)));
  
  const handleChange = (row, column, event) => {
    let newChecked = [...checked];
    newChecked[row][column] = event.target.checked;
    setChecked(newChecked);
    // let dishes = {};
    // for ( let i = 0; i < checked.length; i++) {
    //   for (let j = 0; j < checked[i].length; j++) {
    //     if(checked[i][j]) 
    //       let newEntry = {`person ${i}`: [...dishes.get(`person ${i}`), order[j].id]};
    //   }
    // }
    console.log(checked);
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300, width: 550, boxShadow: 3 }}>
      <Table stickyHeader size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
                Order
            </TableCell>
            <TableCell>
                Dish
            </TableCell>
            {people.map((column, index) => (
              <TableCell>
                  Person {index + 1}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {order.map((row, rowIndex) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                  {row.id}
              </TableCell>
              <TableCell component="th" scope="row">
                  {row.name}
              </TableCell>
              {people.map((column, columnIndex) => (
                <TableCell align='center'>
                  <Checkbox 
                    sx={{ p: 0 }}
                    checked={checked[rowIndex][columnIndex]}
                    onChange={e => handleChange(rowIndex, columnIndex, e)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}