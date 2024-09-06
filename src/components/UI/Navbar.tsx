import { Link as ReactLink } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, Link } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAuthSlice } from '../../store/authslice/auth';
import Profile from './Profile';

export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);

  return (
    <nav className='tw-border-b-[#ffffff24]'>
      <ul className='tw-container-md tw-mx-auto tw-flex tw-justify-evenly tw-items-center tw-py-2 tw-list-none'>
        <li className='tw-p-1'>
          <Link to='/' component={ReactLink} underline='hover'>
            <img
              className='tw-object-contain'
              src={colorMode === 'light' ? darklogo : lightlogo}
              width={100}
              height={80}
            ></img>
          </Link>
        </li>
        <ul className='tw-list-none tw-flex tw-items-center'>
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
              <Profile />
            )}
          </li>
          <li className='tw-p-1'>
            <Button className={colorMode === 'dark' ? 'tw-border-white' : ''} variant='text' onClick={toggleColorMode}>
              {colorMode === 'dark' ? <LightModeIcon sx={{ color: 'white' }} /> : <DarkModeIcon />}
            </Button>
          </li>
        </ul>
      </ul>
    </nav>
  );
}
