import { Link } from 'react-router-dom';
import logo from '../../../assets/images/LeetCode_logo_rvs.png';
import { CiLight } from 'react-icons/ci';
import { MdOutlineDarkMode } from 'react-icons/md';
import { usethemeUtils } from '../../../context/ThemeWrapper';
export default function HomeNavbar() {
  const { colorMode } = usethemeUtils();

  return (
    <nav className='tw-flex tw-container-md tw-mx-auto tw-flex tw-justify-between tw-px-4'>
      <div>
        <img src={logo} width={30} height={30} className='tw-object-contain'></img>
        <h3>LeetCode</h3>
      </div>
      <ul className='tw-list-none'>
        <li>
          <Link to='/problems'>Explore</Link>
        </li>
        <li>
          <span>{colorMode === 'dark' ? <CiLight /> : <MdOutlineDarkMode />}</span>
        </li>
        <li>
          <Link to='/signin'>SignIn</Link>
        </li>
      </ul>
    </nav>
  );
}
