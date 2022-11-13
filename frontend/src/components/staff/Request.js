import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import useAlert from '../../utilities/useAlert';

export default function Request({table}) {
    // const labelId = `checkbox-list-label-${table}`;

    const { setAlert } = useAlert();

    async function resolveRequest() {
        const response = await fetch(`http://localhost:5000/waiter/assist`, {  
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                table: table
            })
        });
        const data = await response.json();
        if (response.ok) {
            
        } else {
            setAlert(await data.error);
        }
    }

    return ( <>
        <ListItem
            key={table}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={resolveRequest}>
                <ArrowCircleRightIcon />
                </IconButton>
            }
            disablePadding
            divider
        >
        <ListItemButton role={undefined} dense>
            <ListItemIcon>
            <Typography>{table}</Typography>
            </ListItemIcon>
        </ListItemButton>
        </ListItem>
    </>
    )
}