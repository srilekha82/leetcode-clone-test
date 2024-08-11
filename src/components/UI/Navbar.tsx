import { Link } from 'react-router-dom';
import logo from '../../assets/images/LeetCode_logo_rvs.png';
import { MdOutlineDarkMode } from 'react-icons/md';
import { CiLight } from 'react-icons/ci';
import { usethemeUtils } from '../../context/ThemeWrapper';
export default function Navbar() {
  const { colorMode } = usethemeUtils();
  return (
    <nav>
      <ul className='tw-container-md tw-mx-auto tw-flex tw-justify-evenly tw-items-center tw-px-4 tw-list-none'>
        <li>
          <Link to='/'>
            <img className='tw-object-contain' src={logo} width={30} height={30}></img>
          </Link>
        </li>
        <li>
          <Link to='/problems'>Problems</Link>
        </li>
        <li>
          <span>{colorMode === 'dark' ? <CiLight /> : <MdOutlineDarkMode />}</span>
        </li>
      </ul>
    </nav>
  );
}
