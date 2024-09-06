import { Link as ReactLink } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { Avatar, Button, IconButton, Link, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { useAuthSlice } from '../../../store/authslice/auth';
import { useState } from 'react';
import { useUserSlice } from '../../../store/user';
import EmailIcon from '@mui/icons-material/Email';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const signOut = useAuthSlice((state) => state.signOut);
  const user = useUserSlice((state) => state.user);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <nav className='tw-container-lg tw-mx-auto tw-flex tw-justify-around tw-p-2 tw-bottom-2 tw-border-b-[#ffffff24]'>
      <div className='tw-flex tw-items-center tw-gap-2'>
        <img
          src={colorMode === 'light' ? darklogo : lightlogo}
          width={100}
          height={80}
          className='tw-object-contain'
        ></img>
      </div>
      <ul className='tw-list-none tw-flex tw-justify-between tw-items-center'>
        <li className='tw-flex tw-justify-center tw-items-center'>
          {!isLogedIn ? (
            <div className='tw-flex tw-justify-between tw-items-center'>
              <Link
                className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                underline='hover'
                component={ReactLink}
                to='/signin'
              >
                Sign in
              </Link>
              <span>or</span>
              <Link
                className={`tw-py-2 tw-px-4 ${colorMode === 'dark' ? 'tw-text-white' : ''}`}
                underline='hover'
                component={ReactLink}
                to='/signup'
              >
                Sign up
              </Link>
            </div>
          ) : (
            <>
              <Tooltip title='Account settings'>
                <IconButton
                  onClick={handleClick}
                  size='small'
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>{user?.username[0]}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id='account-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleClose}>
                  <EmailIcon /> {user?.email}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon
                    onClick={() => {
                      signOut();
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </li>
        <li>
          <Button
            className={colorMode === 'dark' ? 'tw-border-white' : ''}
            variant='text'
            onClick={toggleColorMode}
            size='large'
          >
            {colorMode === 'dark' ? <LightModeOutlinedIcon sx={{ color: 'white' }} /> : <DarkModeIcon />}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
