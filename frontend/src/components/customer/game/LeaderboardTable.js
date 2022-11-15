import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography } from '@mui/material';

export default function LeaderboardTable({leaderboard}) {
  return (
      <TableContainer component={Paper} sx={{ maxHeight: 458, width: 500, mx: 1, boxShadow: 3 }}>
        <Table sx={{ width: 500 }}  size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant='h4'>
                  Rank
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h4'>
                  Name
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant='h4'>
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
                  <Typography variant='h6' sx={{ fontWeight: 'regular' }}>
                    {row.position}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6' sx={{ fontWeight: 'regular' }}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant='h6' sx={{ fontWeight: 'regular' }}>
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