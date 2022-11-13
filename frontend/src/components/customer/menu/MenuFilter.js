import * as React from 'react';
import { ReactComponent as DairyIcon } from './DF.svg';
import { ReactComponent as GlutenIcon } from './GF.svg';
import { ReactComponent as NutIcon } from './NF.svg';
import { ReactComponent as StarIcon } from './CR.svg';
import { ReactComponent as VeganIcon } from './VE.svg';
import { ReactComponent as VegIcon } from './V.svg';
import { Chip, Stack } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';

// ----------------------------------------------------------------------

function MenuFilter({ submit }) {
  // const [filters, setFilters] = React.useState([]);
  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Chef's Recommendation", icon: StarIcon, selected: 'outlined default' },
    { key: 1, label: 'Vegetarian', icon: VegIcon, selected: 'outlined default' },
    { key: 2, label: 'Vegan', icon: VeganIcon, selected: 'outlined default' },
    { key: 3, label: 'Gluten Free', icon: GlutenIcon, selected: 'outlined default' },
    { key: 4, label: 'Nut Free', icon: NutIcon, selected: 'outlined default' },
    { key: 5, label: 'Dairy Free', icon: DairyIcon, selected: 'outlined default' },
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
    <Stack direction="row" spacing={1} sx={{ mr: 5, mt: 4 }}>
      {chipData.map((data) => (
        <Stack key={data.key}>
          <Chip 
            variant={data.selected.split(' ')[0]} 
            color={data.selected.split(' ')[1]} 
            size="small"
            icon={<SvgIcon component={data.icon}/>}
            label={data.label}
            onClick={handleClick(data)}
          />
        </Stack>
      ))}
    </Stack>
  );
}

export default MenuFilter;