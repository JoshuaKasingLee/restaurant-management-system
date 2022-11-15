import React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordInput ({ labelName, value, id, submit }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (prop) => (event) => {
    submit(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(showPassword => !showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">{labelName}</InputLabel>
        <OutlinedInput
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          required
          onChange={handleChange('password')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={labelName}
        />
        { labelName !== 'Password*' &&
          <FormHelperText id="filled-weight-helper-text">
            Password must be at least ten (10) characters in length, contain at 
            least one (1) uppercase letter (A-Z) and one (1) digit (0-9)
          </FormHelperText>
        }
      </FormControl>
    </>
  )
}