import { Link as ReactLink, useNavigate, useParams } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, ButtonGroup, Link } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAuthSlice } from '../../store/authslice/auth';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import Profile from './Profile';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { useProblemSlice } from '../../store/problemSlice/problem';
import { getRandomIndex } from '../../utils/helpers';
import { useCallback } from 'react';

export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const { problems } = useProblemSlice();
  const { problemname } = useParams();
  const navigate = useNavigate();
  
  const problemNextPageHandler = useCallback(() => {
    const currentProblemIndex = problems.indexOf(problemname?.slice(0, problemname.length - 1) as string);
    if (currentProblemIndex === problems.length - 1) {
      navigate(`/problems/${problems[0]}1`);
    } else {
      const previousProblem = problems[currentProblemIndex + 1];
      navigate(`/problems/${previousProblem}${currentProblemIndex + 2}`);
    }
  }, [problems]);

  const problemPreviousPage = useCallback(() => {
    const currentProblemIndex = problems.indexOf(problemname?.slice(0, problemname.length - 1) as string);
    if (currentProblemIndex === 0) {
      navigate(`/problems/${problems[problems.length - 1]}${problems.length}`);
    } else {
      const previousProblem = problems[currentProblemIndex - 1];
      navigate(`/problems/${previousProblem}${currentProblemIndex}`);
    }
  }, [problems]);

  const randomProblemHandler = useCallback(() => {
    const randomIndex = getRandomIndex(problems.length);
    navigate(`/problems/${problems[randomIndex]}${randomIndex + 1}`);
  }, [problems]);

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
        <li>
          <div className='tw-flex tw-items-center tw-gap-3'>
            <ButtonGroup
              disabled={problems.length === 0}
              size='medium'
              variant='outlined'
              aria-label='Basic button group'
            >
              <Button>
                <DoubleArrowOutlinedIcon />
                Problem List
              </Button>
              <Button size='small' onClick={problemPreviousPage}>
                <ChevronLeftOutlined></ChevronLeftOutlined>
              </Button>
              <Button size='small' onClick={problemNextPageHandler}>
                <ChevronRightOutlined></ChevronRightOutlined>
              </Button>
              <Button size='small' onClick={randomProblemHandler}>
                <ShuffleOutlinedIcon />
              </Button>
            </ButtonGroup>
          </div>
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
