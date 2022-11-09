import * as React from 'react';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Typography } from '@mui/material';

export default function PaymentDishelection({ people, order }) {
  const [checked, setChecked] = React.useState(Array.from({length: order.length},() => Array.from({length: people.length}, () => false)));
  
  const handleChange = (row, column, event) => {
    let newChecked = [...checked];
    newChecked[row][column] = event.target.checked;
    setChecked(newChecked);

    let splitDishes = {};
    let dishes = [];
    for ( let i = 0; i < people.length; i++) {
      dishes = [];
      for (let j = 0; j < order.length; j++) {
        if(checked[j][i]) dishes.push(order[j].id);
      }
      splitDishes[`person${i+1}`] = dishes;
    }
    localStorage.setItem('dishes', JSON.stringify(splitDishes));
    // console.log(localStorage.getItem('dishes'));
    console.log(checked);
    console.log(splitDishes);
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300, width: 550, boxShadow: 3 }}>
      <Table stickyHeader size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align='center' sx={{width:'100px'}}>
                Dish
            </TableCell>
            {people.map((column, index) => (
              <TableCell align='center' >
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
              <TableCell component="th" align='center' scope="row">
                  {row.name}
                  <img src={row.img} alt={row.name}/>
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