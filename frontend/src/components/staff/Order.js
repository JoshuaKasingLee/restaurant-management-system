import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import useAlert from '../../utilities/useAlert';

export default function Order({id, table, name, nextStatus, role}) {
    const labelId = `checkbox-list-label-${table}`;

    const { setAlert } = useAlert();

    async function progressOrderStatus() {
        const response = await fetch(`http://localhost:5000/${role}/orders`, {  
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                id: id,
                status: nextStatus
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
            key={id}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={progressOrderStatus}>
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
                <ListItemText id={labelId} primary={name} />
            </ListItemButton>
        </ListItem>
    </>
    )
}