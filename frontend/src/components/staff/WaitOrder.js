import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export default function WaitOrder({table, name}) {
    const labelId = `checkbox-list-label-${table}`;

    return ( <>
        <ListItem
        key={table}
        secondaryAction={
            <IconButton edge="end" aria-label="comments">
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