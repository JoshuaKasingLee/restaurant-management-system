import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography } from '@mui/material';

function createData(position, name, score) {
  return { position, name, score };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0),
  createData('Ice cream sandwich', 237, 9.0),
  createData('Eclair', 262, 16.0),
  createData('Cupcake', 305, 3),
  createData('Gingerbread', 356, 16.0),
];

export default function LeaderboardTable({leaderboard}) {
  return (
    <TableContainer component={Paper} sx={{ width: 685, border:1, mx:1 }}>
      <Table sx={{ width: 680 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='h3'>
                Rank
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h3'>
                Name
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant='h3'>
                Score
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard.map((row) => (
            <TableRow
              key={row.position}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant='h4'>
                  {row.position}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h4'>
                  {row.name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant='h4'>
                  {row.score}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}