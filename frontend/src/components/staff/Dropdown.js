import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({update}) {
  // TODO: dynamically add categories
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Category"
          defaultValue=""
          onChange={e => update(e.target.value)}
        >
          <MenuItem value="Sashimi">Sashimi</MenuItem>
          <MenuItem value="Noodle">Noodle</MenuItem>
          <MenuItem value="Rice bowl">Rice bowl</MenuItem>
          <MenuItem value="Dessert">Dessert</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}