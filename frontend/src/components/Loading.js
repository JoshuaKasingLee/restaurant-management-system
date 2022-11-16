import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', position: 'fixed', justfyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ m: 'auto' }}/>
    </Box>
  );
}