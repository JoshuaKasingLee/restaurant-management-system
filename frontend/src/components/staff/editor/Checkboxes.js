import * as React from 'react';
import { Box, Checkbox, InputLabel, ListItemText, FormControl, MenuItem, 
  OutlinedInput, Select } from '@mui/material';
import { ALL_TAGS_LIST } from '../../../utilities/constants';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function Checkboxes({update, tags}) {

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    update(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Tags</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          multiple
          value={tags}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {ALL_TAGS_LIST.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={tags && (tags.indexOf(name) > -1)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}