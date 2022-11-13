import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography } from '@mui/material';

export default function LeaderboardTable({leaderboard}) {
  return (
      <TableContainer component={Paper} sx={{ maxHeight: 470, width: 685, mx: 1, boxShadow: 3 }}>
        <Table sx={{ width: 680 }}  size="small" stickyHeader>
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
            {leaderboard.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant='h6'>
                    {row.position}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6'>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant='h6'>
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