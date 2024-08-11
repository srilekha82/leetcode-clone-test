import { Link } from 'react-router-dom';
import darklogo from '../../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../../assets/images/logo-light.5034df26.svg';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { Button } from '@mui/material';
export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();

  return (
    <nav className='tw-flex tw-container-lg tw-mx-auto tw-flex tw-justify-between tw-px-4'>
      <div className='tw-flex tw-items-center tw-gap-2'>
        <img
          src={colorMode === 'light' ? darklogo : lightlogo}
          width={100}
          height={80}
          className='tw-object-contain'
        ></img>
      </div>
      <ul className='tw-list-none tw-flex tw-justify-between tw-p-4 w-items-center tw-w-60'>
        <li>
          <Link to='/problems'>Explore</Link>
        </li>
        <li>
          <Link to='/signin'>SignIn</Link>
        </li>
        <li>
          <Button onClick={toggleColorMode} variant='text'>
            {colorMode === 'dark' ? <CiLight /> : <MdOutlineDarkMode />}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
