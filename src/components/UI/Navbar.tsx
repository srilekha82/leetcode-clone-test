import { Link as ReactLink } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { MdOutlineDarkMode } from 'react-icons/md';
import { CiLight } from 'react-icons/ci';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, Link } from '@mui/material';
export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  return (
    <nav>
      <ul className='tw-container-md tw-mx-auto tw-flex tw-justify-evenly tw-items-center tw-py-1 tw-list-none'>
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
            <Link component={ReactLink} to='/problems' underline='hover'>
              Explore
            </Link>
          </li>
          <li className='tw-p-1'>
            <Button variant='text' onClick={toggleColorMode}>
              {colorMode === 'dark' ? <CiLight fontSize={18} /> : <MdOutlineDarkMode fontSize={18} />}
            </Button>
          </li>
        </ul>
      </ul>
    </nav>
  );
}
