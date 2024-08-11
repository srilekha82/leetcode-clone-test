import { Link } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { MdOutlineDarkMode } from 'react-icons/md';
import { CiLight } from 'react-icons/ci';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button } from '@mui/material';
export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  return (
    <nav>
      <ul className='tw-container-md tw-mx-auto tw-flex tw-justify-evenly tw-items-center tw-px-4 tw-list-none'>
        <li>
          <Link to='/'>
            <img
              className='tw-object-contain'
              src={colorMode === 'light' ? darklogo : lightlogo}
              width={100}
              height={80}
            ></img>
          </Link>
        </li>
        <li>
          <Link to='/problems'>Problems</Link>
        </li>
        <li>
          <Button variant='text' onClick={toggleColorMode}>
            {colorMode === 'dark' ? <CiLight /> : <MdOutlineDarkMode />}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
