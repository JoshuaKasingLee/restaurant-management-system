import * as React from 'react';
import { Box, CircularProgress } from '@mui/material/';

export default function CircularIndeterminate() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100%', 
        width: '100%', 
        position: 'fixed', 
        justfyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <CircularProgress sx={{ m: 'auto' }}/>
    </Box>
  );
}