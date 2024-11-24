import { Link as ReactLink, useNavigate, useParams } from 'react-router-dom';
import darklogo from '../../assets/images/logo-dark.26900637.svg';
import lightlogo from '../../assets/images/logo-light.5034df26.svg';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, ButtonGroup, Link, Stack, Typography } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import { useAuthSlice } from '../../store/authslice/auth';
import DoubleArrowOutlinedIcon from '@mui/icons-material/DoubleArrowOutlined';
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import Profile from './Profile';
import { ChevronRightOutlined, ChevronLeftOutlined } from '@mui/icons-material';
import { useProblemSlice } from '../../store/problemSlice/problem';
import { getRandomIndex } from '../../utils/helpers';
import { useCallback, useReducer } from 'react';
import CustomDrawer from './Drawer';

export default function Navbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const { problems } = useProblemSlice();
  const { problemname } = useParams();
  const navigate = useNavigate();
  const [openDrawer, toggleDrawerVisiblility] = useReducer((state) => !state, false);

  const problemNextPageHandler = useCallback(() => {
    const currentProblemIndex = problems.findIndex(
      (p) => p._id === (problemname?.slice(0, problemname.length - 1) as string)
    );
    if (currentProblemIndex === problems.length - 1) {
      navigate(`/problems/${problems[0]._id}1`);
    } else {
      const previousProblem = problems[currentProblemIndex + 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex + 2}`);
    }
  }, [problems]);
  const toggleDrawer = () => {
    toggleDrawerVisiblility();
  };

  const problemPreviousPage = useCallback(() => {
    const currentProblemIndex = problems.findIndex(
      (p) => p._id === (problemname?.slice(0, problemname.length - 1) as string)
    );
    if (currentProblemIndex === 0) {
      navigate(`/problems/${problems[problems.length - 1]._id}${problems.length}`);
    } else {
      const previousProblem = problems[currentProblemIndex - 1];
      navigate(`/problems/${previousProblem._id}${currentProblemIndex}`);
    }
  }, [problems]);

  const randomProblemHandler = useCallback(() => {
    const randomIndex = getRandomIndex(problems.length);
    navigate(`/problems/${problems[randomIndex]._id}${randomIndex + 1}`);
  }, [problems]);

  return (
    <>
      {problems.length > 0 && <CustomDrawer problems={problems} open={openDrawer} toggleDrawer={toggleDrawer} />}
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
          {isLogedIn && (
            <li>
              <div className='tw-flex tw-items-center tw-gap-3'>
                <ButtonGroup
                  disabled={problems.length === 0}
                  size='medium'
                  variant='outlined'
                  aria-label='Basic button group'
                >
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    onClick={() => toggleDrawerVisiblility()}
                  >
                    <Stack gap='2' alignItems='center' flexDirection='row'>
                      <span>
                        <DoubleArrowOutlinedIcon
                          sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                        />
                      </span>
                      <Typography variant='body2'>Problem List</Typography>
                    </Stack>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    size='small'
                    onClick={problemPreviousPage}
                  >
                    <ChevronLeftOutlined
                      sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    ></ChevronLeftOutlined>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    size='small'
                    onClick={problemNextPageHandler}
                  >
                    <ChevronRightOutlined
                      sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    ></ChevronRightOutlined>
                  </Button>
                  <Button
                    sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }}
                    size='small'
                    onClick={randomProblemHandler}
                  >
                    <ShuffleOutlinedIcon sx={{ color: colorMode === 'dark' ? 'common.white' : 'primart.dark' }} />
                  </Button>
                </ButtonGroup>
              </div>
            </li>
          )}
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
              <Button
                className={colorMode === 'dark' ? 'tw-border-white' : ''}
                variant='text'
                onClick={toggleColorMode}
              >
                {colorMode === 'dark' ? <LightModeIcon sx={{ color: 'white' }} /> : <DarkModeIcon />}
              </Button>
            </li>
          </ul>
        </ul>
      </nav>
    </>
  );
}
