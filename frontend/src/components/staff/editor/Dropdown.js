import * as React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function Dropdown({update, category}) {

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required>
        <InputLabel id="dropdown-select-label">Category</InputLabel>
        <Select
          labelId="dropdown-select-label"
          id="dropdown-select"
          label="Category"
          defaultValue=""
          value={category}
          onChange={e => update(e.target.value)}
        >
          {JSON.parse(localStorage.getItem("menu")).categories.map(c => (
              <MenuItem key={c.id} value={c.name}>{c.name}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}