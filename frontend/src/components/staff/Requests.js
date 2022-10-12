import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Request from './Request'


export default function Requests() {

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItem>
        <Typography sx={{minWidth: '56px'}}>Table</Typography>
      </ListItem>
      {[0, 1, 2, 3].map((value) => {
        return (
          <Request key={value} table={value} />
        );
      })}
    </List>
  );
}