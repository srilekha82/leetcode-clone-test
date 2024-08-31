import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { MdOutlineVisibility } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';
import { useMutation } from '@tanstack/react-query';
import signIn from '../../../services/signIn';
import { useCookies } from 'react-cookie';
export default function LoginForm() {
  const [cookies] = useCookies();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const { mutate } = useMutation({
    mutationFn: signIn,
    mutationKey: ['signIn'],
    onSuccess(data, _) {
      console.log(data);
      console.log(cookies);
    },
  });
  const onClickHandler = () => {
    mutate({ email, password });
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FormControl variant='outlined' size='small'>
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id='standard-basic'
          type='email'
          label='E-mail'
          variant='outlined'
          size='small'
        />
      </FormControl>
      <FormControl variant='outlined' size='small'>
        <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
        <OutlinedInput
          id='outlined-adornment-password'
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          size='small'
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
              </IconButton>
            </InputAdornment>
          }
          label='password'
        />
      </FormControl>
      <Button variant='contained' onClick={onClickHandler}>
        Sign In
      </Button>
    </Box>
  );
}
