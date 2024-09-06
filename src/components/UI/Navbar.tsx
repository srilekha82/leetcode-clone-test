import { Link as ReactLink } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, Link } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  return (
    <nav>
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
          <li className='tw-p-1'>
            <Button
              className={colorMode === 'dark' ? 'tw-border-white' : ''}
              variant='outlined'
              onClick={toggleColorMode}
            >
              {colorMode === 'dark' ? <WbSunnyIcon /> : <DarkModeIcon />}
            </Button>
          </li>
        </ul>
      </ul>
    </nav>
  );
}
