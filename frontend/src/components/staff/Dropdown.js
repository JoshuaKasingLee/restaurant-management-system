import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Dropdown({update, category}) {
  
  // React.useEffect(() => {console.log("CATEGORY", category)});

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
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