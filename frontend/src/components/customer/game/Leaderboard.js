import { styled } from '@mui/material/styles';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

function Leaderboard({submit}) {

  const start = () => {
    submit(true);
  };

  return (
    // <Box sx={{ flexGrow: 1, border: 1 }}>
    //   <Grid container spacing={2}>
    //     <Grid 
    //       item xs={4} 
    //       sx={{ height: '75vh', border: 1, borderRadius: 5 }}
    //     >
    //       <Item>
    //         <Typography variant='h2' align='center'>
    //           Instructions
    //         </Typography>
    //         <Box sx={{ height: '60vh' }} display='flex' justifyContent='center' alignItems='center'>
    //           <IconButton onClick={start}>
    //             <PlayCircleRoundedIcon sx={{width: 150, height:150 }} />
    //           </IconButton>
    //         </Box>
    //       </Item>
    //     </Grid>
    //     <Grid 
    //       item xs={8} 
    //       sx={{ height: '75vh', border: 1, borderRadius: 5 }}
    //     >
    //       <Item>
    //         <Typography variant='h2'>
    //           Leaderboard (coming soon...)
    //         </Typography>
    //       </Item>
    //     </Grid>
    //   </Grid>
    // </Box>
    <Box sx={{ ml: 4, mr: 1, mt: 4, flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={3.8} sx={{ height: '75vh', mx:1, border: 1, borderRadius: 3 }}>
          <Item>
            <Typography variant='h2' align='center'>
              Instructions
            </Typography>
            <Box sx={{ height: '60vh' }} display='flex' justifyContent='center' alignItems='center'>
              <IconButton onClick={start}>
                <PlayCircleRoundedIcon sx={{width: 150, height:150 }} />
              </IconButton>
            </Box>
          </Item>
        </Grid>
        <Grid item xs={6} md={7.8} sx={{ mx: 1, border: 1, borderRadius: 3 }}>
          <Item>
            <Typography variant='h2'>
              Leaderboard (coming soon...)
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Leaderboard;