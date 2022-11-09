import * as React from 'react';
import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow } from '@mui/material';

export default function PaymentDishelection({ submit, people, order }) {
  const [checked, setChecked] = React.useState(Array.from({length: order.length},() => Array.from({length: people.length}, () => false)));
  const [valid, setValid] = React.useState(false);

  React.useEffect(() => {
    submit(valid);
  }, [submit, valid]);

  const handleChange = (row, column, event) => {

    // update checked array
    let newChecked = [...checked];
    newChecked[row][column] = event.target.checked;
    setChecked(newChecked);

    // check if all dishes have at least one check
    let dishChecked = Array(order.length).fill(false);
    for ( let i = 0; i < order.length; i++ ) {
      if (checked[i].includes(true)) 
        dishChecked[i] = true;
    }
    if (!dishChecked.includes(false)) 
      setValid(true);
    else setValid(false);

    console.log(valid);

    // convert into required json format to be given to backend
    let splitDishes = {};
    let dishes = [];
    for ( let i = 0; i < 4; i++ ) {
      dishes = [];
      for ( let j = 0; j < order.length; j++ ) {
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
            <TableCell align='center' sx={{width:'100px'}} key='dish'>
                Dish
            </TableCell>
            {people.map((column, index) => (
              <TableCell align='center' key={`person${index + 1}`}>
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
              <TableCell component="th" align='center' scope="row" key={`dish${rowIndex}`}>
                  {row.name}
                  <img src={row.img} alt={row.name}/>
              </TableCell>
              {people.map((column, columnIndex) => (
                <TableCell align='center' key={`person${rowIndex}${columnIndex}`}>
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