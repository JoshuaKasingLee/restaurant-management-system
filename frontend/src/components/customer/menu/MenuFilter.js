import * as React from 'react';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { Chip, Stack } from '@mui/material';

// ----------------------------------------------------------------------

function MenuFilter({ submit }) {
  // const [filters, setFilters] = React.useState([]);
  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Chef's Recommendation", icon: TagFacesIcon, selected: 'outlined default' },
    { key: 1, label: 'Vegetarian', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 2, label: 'Vegan', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 3, label: 'Gluten Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 4, label: 'Nut Free', icon: TagFacesIcon, selected: 'outlined default' },
    { key: 5, label: 'Dairy Free', icon: TagFacesIcon, selected: 'outlined default' },
  ]);

  const handleClick = (data) => () => {
    let newChipData = [...chipData];
    let newSelected = ((data.selected === 'filled primary') ? 'outlined default' : 'filled primary');
    newChipData[data.key] = { key: data.key, label: data.label, icon: data.icon, selected: newSelected };
    setChipData(newChipData);
    if (newSelected === 'filled primary') {
      submit( state => ([...state, data.label].sort()) );
    } else {
      submit( filters => filters.filter(state => state !== data.label) );
    }
  };
  
  return (
    <Stack direction="row" spacing={1}>
      {chipData.map((data) => (
        <Stack key={data.key}>
          <Chip 
            variant={data.selected.split(' ')[0]} 
            color={data.selected.split(' ')[1]} 
            size="small"
            icon={<data.icon/>}
            label={data.label}
            onClick={handleClick(data)}
          />
        </Stack>
      ))}
    </Stack>
  );
}

export default MenuFilter;