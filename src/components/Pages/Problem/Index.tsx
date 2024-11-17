import { useNavigate, useParams } from 'react-router';
import { Editor, Monaco } from '@monaco-editor/react';
import * as monaco from '@monaco-editor/react';
import { useMutation } from '@tanstack/react-query';
import getProblem from '../../../services/getProblem';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useReducer, useRef, useState } from 'react';
import Layout from '../../UI/Layout';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import LanguageDropDown from './LanguageDropDown';
import { darktheme, lighttheme, supportedLanguages, theme } from '../../../constants/Index';
import { useAuthSlice } from '../../../store/authslice/auth';
import submitCode from '../../../services/sumbitCode';
import getStatus from '../../../services/getSubmissionStatus';
import transformInput, { a11yProps, getGridColumnStyles, getResult } from '../../../utils/helpers';
import CustomTabPanel from '../../UI/TabPanel';
import {
  Problem as ProblemType,
  problemsubmissionstatus,
  ShrinkActionKind,
  submission,
  user,
} from '../../../utils/types';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useUserSlice } from '../../../store/user';
import SkeletonResultsLoader from '../../UI/SkeletonResultsLoader';
import addSubmission from '../../../services/addSubmission';
import batchwiseSubmission from '../../../services/batchwiseSubmission';
import ProblemSubmissions from './ProblemSubmissions';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { initialShrinkState, shrinkReducer } from '../../reducers/ShrinkReducer';

export default function Problem() {
  const { problemname } = useParams();
  const editorRef = useRef(null);
  const user = useUserSlice((state) => state.user);
  const setUser = useUserSlice((state) => state.setUser);
  const { colorMode } = usethemeUtils();
  const [open, setOpen] = useState<boolean>(true);
  const [langauge, setLangauge] = useState<number>(93);
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isSumbitted, setIsSumbitted] = useState<boolean>(false);
  const [submissionTab, setSubmissionTab] = useState<number>(0);
  const [submissionStatusLoading, setSubmissionStatusLoading] = useState<boolean>(false);
  const [submissionStatusError, setSubmissionStatusError] = useState<boolean>(false);
  const [submissionStatusInprocess, setSubmissionStatusInProcess] = useState<boolean>(false);
  const [problemSubmissionLoading, setProblemSubmissionLoading] = useState<boolean>(false);
  const [problemSubmissionStatus, setProblemSubmissionStatus] = useState<'Accepted' | 'Rejected' | ''>('');
  const [problemsuccessCount, setSuccessCount] = useState<number>(0);
  const [leftTab, setLeftTab] = useState<number>(0);
  const [problemRunStatus, setproblemRunStatus] = useState<submission[]>([]);
  const [problemsubmissions, setProblemSubmissions] = useState<problemsubmissionstatus[]>(user?.submissions ?? []);
  const [isProblemLoading, setIsProblemLoading] = useState<boolean>(false);
  const [problemInfo, setProblemInfo] = useState<ProblemType | null>(null);
  const [isErrorWithProblemInfo, setIsErrorWithProblemInfo] = useState<boolean>(false);
  const [errorInfoProblemFetch, setErrorInfoProblemFetch] = useState<Error | null>(null);
  const [code, setCode] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      (async () => {
        setIsProblemLoading(true);
        const problemResponse = await getProblem(problemname?.slice(0, problemname.length - 1) as string);
        setIsProblemLoading(false);
        if (problemResponse?.status === 'Success') {
          setProblemInfo(problemResponse.data);
          const storedCode = localStorage.getItem(`${problemname?.slice(0, problemname.length - 1)}`);
          if (storedCode) {
            const parsedCode = JSON.parse(storedCode);
            setCode(parsedCode);
          } else {
            setCode({ [langauge]: problemResponse.data?.starterCode.find((s) => s.lang_id == langauge)?.code ?? '' });
          }
        } else {
          throw new Error(problemResponse?.error);
        }
      })();
    } catch (error) {
      setIsProblemLoading(false);
      setIsErrorWithProblemInfo(true);
      if (error instanceof Error) {
        setErrorInfoProblemFetch(error);
      }
    }
  }, [problemname]);

  const [isLeftPanelExpanded, toggleLeftPanelExpansion] = useReducer((state) => {
    if (state && editorRef.current) {
      // @ts-ignore
      editorRef.current.layout({});
    }
    return !state;
  }, false);
  const [isRightPanelExpanded, toggleRightPanelExpansion] = useReducer((state) => !state, false);
  const [shrinkState, actiondispatcher] = useReducer(shrinkReducer, initialShrinkState);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  const handleSubmissionTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSubmissionTab(newValue);
  };

  const handleLeftTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setLeftTab(newValue);
  };
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (id: number) => {
    setLangauge(id);
    setCode((prev) => {
      const copy = { ...prev };
      if (!copy[id]) {
        copy[id] = problemInfo?.starterCode.find((s) => s.lang_id == id)?.code ?? '';
      }
      return copy;
    });
  };
  useEffect(() => {
    if (user?.submissions.length) {
      setProblemSubmissions(user?.submissions.filter((sub)=>sub.problemId===problemname?.slice(0, problemname.length - 1)));
    }
  }, [user?.submissions.length,problemname]);

  const { mutateAsync } = useMutation({
    mutationKey: ['codesubmission'],
    mutationFn: submitCode,
  });
  const { mutateAsync: updateSubmitMutateAsync } = useMutation({
    mutationKey: ['updatesubmission'],
    mutationFn: addSubmission,
  });

  useEffect(() => {
    monaco.loader.init().then((monacoinstance: Monaco) => {
      monacoinstance.editor.defineTheme('mylightTheme', lighttheme as theme);
      monacoinstance.editor.defineTheme('mydarkTheme', darktheme as theme);
    });
    return () => {
      setProblemSubmissions([]);
    };
  }, [colorMode]);

  if (isProblemLoading) {
    return (
      <>
        <Backdrop
          sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </>
    );
  }

  if (isErrorWithProblemInfo) {
    return (
      <Layout>
        <Alert className='tw-mx-auto' severity='error'>
          {errorInfoProblemFetch?.message}
        </Alert>
      </Layout>
    );
  }

  const getSubmission = async (id: string) => {
    async function getData<T extends submission>(response: T) {
      if (!['Processing', 'In Queue'].includes(response?.status?.description)) {
        setSubmissionStatusInProcess(false);
        return response;
      }
      try {
        const submissionresponse = await getStatus(id);
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve('resolved');
          }, 2000);
        });
        setSubmissionStatusInProcess(true);
        return getData(submissionresponse as submission);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
          throw error;
        }
      }
    }
    try {
      setSubmissionStatusLoading(true);
      // @ts-ignore
      const data = await getData({ status: { description: 'Processing' } });
      console.log({ data });
      setSubmissionStatusLoading(false);
      setproblemRunStatus([data as submission]);
      return data;
    } catch (error) {
      setSubmissionStatusLoading(false);
      setSubmissionStatusError(true);
      console.error(error);
    }
  };

  const onClickHandler = async () => {
    if (!isLogedIn) {
      navigate('/signin');
    }

    if (editorRef.current && problemInfo) {
      const output = problemInfo?.sampleOutput ?? '';
      // @ts-ignore
      const code = `${problemInfo.imports.find((s) => s.lang_id == langauge)?.code} \n${editorRef.current.getValue()} \n${problemInfo?.systemCode.find((s) => s.lang_id == langauge)?.code}`;
      try {
        const input = transformInput(
          problemInfo?.sampleInput as string,
          problemInfo?.metadata.judge_input_template as string,
          problemInfo?.metadata.variables_names as Record<string, string>,
          problemInfo?.metadata.variables_types as Record<string, string>
        );
        setIsSumbitted(true);
        setCurrentTab(1);
        const response = await mutateAsync({ code, expected_output: output, input, language_id: langauge });
        setSubmissionId(response?.data.token);
        const submissionResponse = await getSubmission(response?.data.token);
        console.log(submissionResponse);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmitHandler = async () => {
    if (!isLogedIn) {
      navigate('/signin');
    }
    if (editorRef.current && problemInfo) {
      const submissionbatch = [];
      const testcases = problemInfo?.testCases;
      // @ts-ignore
      const code = `${problemInfo.imports.find((s) => s.lang_id == langauge)?.code} \n ${editorRef.current.getValue()} \n ${problemInfo?.systemCode.find((s) => s.lang_id == langauge)?.code}`;
      if (testcases?.length) {
        for (let index = 0; index < testcases?.length; index++) {
          if (testcases) {
            const { input, output } = testcases[index];
            submissionbatch.push({
              language_id: langauge,
              source_code: code,
              stdin: input,
              expected_output: output,
            });
          }
        }
      }
      try {
        setCurrentTab(2);
        setProblemSubmissionLoading(true);
        const batchwiseresponse = await batchwiseSubmission(submissionbatch);
        // @ts-ignore
        const batchwiseresponsepromises = [];
        batchwiseresponse?.forEach((submission) => {
          batchwiseresponsepromises.push(getSubmission(submission.token));
        });
        // @ts-ignore
        const batchwiseresults = await Promise.all(batchwiseresponsepromises);
        setProblemSubmissionLoading(false);
        console.log(batchwiseresults);
        const { status, successcount } = getResult(batchwiseresults);
        setSuccessCount(successcount);
        if (status) {
          setProblemSubmissionStatus('Accepted');
        } else {
          setProblemSubmissionStatus('Rejected');
        }
        const updatesubmissionbody = {
          problemId: problemname?.slice(0, problemname.length - 1) as string,
          languageId: langauge,
          status: status ? 'Accepted' : 'Wrong Answer',
          submissionId: submissionId,
          submittedAt: new Date(),
        };
        const submissionupdateResponse = await updateSubmitMutateAsync({
          id: user?._id as string,
          newsubmission: updatesubmissionbody,
        });
        console.log(submissionupdateResponse);
        setProblemSubmissions((prev) => [...prev, updatesubmissionbody]);
        setUser({
          ...(user as user),
          submissions: [
            ...(user?.submissions ?? []),
            {
              problemId: problemname?.slice(0, problemname.length - 1) as string,
              submissionId: submissionupdateResponse?.data._id as string,
              languageId: langauge,
              status: status ? 'Accepted' : 'Wrong Answer',
              submittedAt: new Date(),
            },
          ],
        });
      } catch (error) {
        setProblemSubmissionLoading(false);
        setProblemSubmissionStatus('Rejected');
        const submissionupdateResponse = await updateSubmitMutateAsync({
          id: user?._id as string,
          newsubmission: {
            problemId: problemname?.slice(0, problemname.length - 1) as string,
            languageId: langauge,
            status: 'Wrong Answer',
            submissionId: submissionId,
            submittedAt: new Date(),
          },
        });
        setProblemSubmissions((prev) => [
          ...prev,
          {
            problemId: problemname?.slice(0, problemname.length - 1) as string,
            languageId: langauge,
            status: 'Wrong Answer',
            submissionId: submissionId,
            submittedAt: new Date(),
          },
        ]);

        console.log(submissionupdateResponse);
        console.log(error);
      }
    }
  };

  return (
    <Layout className='problem-layout' showFooter={false}>
      <div
        className={`tw-gap-2 tw-h-full problem-container ${isLeftPanelExpanded || isRightPanelExpanded ? 'expanded' : !shrinkState.shrinkleftpanel && shrinkState.shrinkrightpanel ? 'leftshrinked' : !shrinkState.shrinkrightpanel && shrinkState.shrinkleftpanel ? 'rightshrinked' : ''}`}
      >
        {!shrinkState.shrinkleftpanel && shrinkState.shrinkrightpanel ? (
          //!left Sidepanel
          <div
            className='tw-flex tw-flex-col tw-justify-between tw-w-full tw-h-full tw-p-2 tw-border-2 tw-rounded-lg'
            style={{
              backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
              borderWidth: '2px',
              borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
              display: isLeftPanelExpanded && shrinkState.shrinkrightpanel ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(
                isLeftPanelExpanded,
                shrinkState.shrinkleftpanel,
                shrinkState.shrinkrightpanel
              ),
            }}
          >
            <Tabs orientation='vertical' value={leftTab} onChange={handleLeftTabChange}>
              <Tab
                className={colorMode === 'dark' ? '!tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
                label='Description'
                sx={{ writingMode: 'vertical-lr' }}
                {...a11yProps(0)}
              ></Tab>
              <Tab
                className={colorMode === 'dark' ? '!tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
                label='Submissions'
                sx={{ writingMode: 'vertical-lr' }}
                {...a11yProps(1)}
              ></Tab>
            </Tabs>
            <IconButton
              onClick={() => {
                //@ts-ignore
                editorRef.current.layout(771, 436);
                actiondispatcher({ type: ShrinkActionKind.EXPANDRIGHTPANEL });
              }}
            >
              <ChevronRightOutlinedIcon />
            </IconButton>
          </div>
        ) : null}
        <div
          className={`tw-w-full tw-h-full tw-p-2 tw-border-2 tw-rounded-lg`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderWidth: '2px',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
            display: isLeftPanelExpanded || shrinkState.shrinkrightpanel ? 'none' : 'block',
            gridColumn: getGridColumnStyles(
              isRightPanelExpanded,
              shrinkState.shrinkrightpanel,
              shrinkState.shrinkleftpanel
            ),
          }}
        >
          <div className='tw-flex tw-items-center tw-justify-between'>
            <Tabs value={leftTab} onChange={handleLeftTabChange}>
              <Tab className={colorMode === 'dark' ? '!tw-text-white' : ''} label='Description' {...a11yProps(0)}></Tab>
              <Tab className={colorMode === 'dark' ? '!tw-text-white' : ''} label='Submissions' {...a11yProps(1)}></Tab>
            </Tabs>
            <div>
              <IconButton
                onClick={() => {
                  toggleRightPanelExpansion();
                }}
                size='small'
              >
                {!isRightPanelExpanded ? <SettingsOverscanOutlinedIcon /> : <CloseFullscreenOutlinedIcon />}
              </IconButton>
              <IconButton
                onClick={() =>
                  !shrinkState.shrinkrightpanel
                    ? actiondispatcher({ type: ShrinkActionKind.SHRINKRIGHTPANEL })
                    : actiondispatcher({ type: ShrinkActionKind.EXPANDRIGHTPANEL })
                }
                size='small'
              >
                {!shrinkState.shrinkrightpanel ? <ChevronLeftOutlinedIcon /> : <ChevronRightOutlinedIcon />}
              </IconButton>
            </div>
          </div>
          <CustomTabPanel value={leftTab} index={0}>
            <Stack spacing={8} className='tw-p-2'>
              <Box>
                <Typography variant='h5'>
                  {problemname?.slice(problemname.length - 1)}. {problemInfo?.title}
                </Typography>
                <div className='tw-mt-2'>
                  <Chip
                    label={problemInfo?.difficulty}
                    color={
                      problemInfo?.difficulty === 'easy'
                        ? 'info'
                        : problemInfo?.difficulty === 'hard'
                          ? 'error'
                          : 'warning'
                    }
                  />
                </div>
                <div className='tw-mt-2'>
                  <Typography variant='subtitle1'>{problemInfo?.description}</Typography>
                </div>
              </Box>
              <Box>
                <Typography variant='h5'>Examples</Typography>
                <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                  <Typography variant='h6'>Input :</Typography>
                  <Typography variant='body2'>{problemInfo?.sampleInput}</Typography>
                </div>
                <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                  <Typography variant='h6'>Output:</Typography>
                  <Typography variant='body2'>{problemInfo?.sampleOutput}</Typography>
                </div>
              </Box>
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={leftTab} index={1}>
            {problemsubmissions.length ? <ProblemSubmissions data={problemsubmissions}></ProblemSubmissions> : null}
          </CustomTabPanel>
        </div>
        {!shrinkState.shrinkrightpanel && shrinkState.shrinkleftpanel ? (
          //!Right Sidepanel
          <div
            className={`tw-p-2 tw-border-2 tw-rounded-lg tw-h-full tw-flex tw-flex-col tw-justify-between`}
            style={{
              backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
              borderWidth: '2px',
              borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
              display: isRightPanelExpanded && shrinkState.shrinkleftpanel ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(
                isRightPanelExpanded,
                shrinkState.shrinkrightpanel,
                shrinkState.shrinkleftpanel
              ),
            }}
          >
            <Tabs orientation='vertical' value={currentTab} onChange={handleTabChange}>
              <Tab
                className={colorMode === 'dark' ? 'tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
                sx={{ writingMode: 'vertical-lr' }}
                label='Code'
                {...a11yProps(0)}
              ></Tab>
              <Tab
                className={colorMode === 'dark' ? 'tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
                sx={{ writingMode: 'vertical-lr' }}
                label='Test Results'
                {...a11yProps(1)}
              ></Tab>
              <Tab
                className={colorMode === 'dark' ? 'tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
                sx={{ writingMode: 'vertical-lr' }}
                label='Output'
                {...a11yProps(2)}
              ></Tab>
            </Tabs>
            <IconButton onClick={() => actiondispatcher({ type: ShrinkActionKind.EXPANDLEFTPANEL })}>
              <ChevronLeftOutlinedIcon />
            </IconButton>
          </div>
        ) : null}
        <div
          className={`tw-p-2 tw-border-2 tw-rounded-lg tw-h-full`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderWidth: '2px',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
            gridColumn: getGridColumnStyles(
              isLeftPanelExpanded,
              shrinkState.shrinkleftpanel,
              shrinkState.shrinkrightpanel
            ),
            display: isRightPanelExpanded || shrinkState.shrinkleftpanel ? 'none' : 'block',
          }}
        >
          <div className='tw-flex tw-items-center tw-justify-between'>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab className={colorMode === 'dark' ? 'tw-text-white' : ''} label='Code' {...a11yProps(0)}></Tab>
              <Tab className={colorMode === 'dark' ? 'tw-text-white' : ''} label='Test Results' {...a11yProps(1)}></Tab>
              <Tab className={colorMode === 'dark' ? 'tw-text-white' : ''} label='Output' {...a11yProps(2)}></Tab>
            </Tabs>
            <div>
              <IconButton onClick={toggleLeftPanelExpansion} size='small'>
                {!isLeftPanelExpanded ? <SettingsOverscanOutlinedIcon /> : <CloseFullscreenOutlinedIcon />}
              </IconButton>
              <IconButton
                onClick={() => {
                  !shrinkState.shrinkleftpanel
                    ? actiondispatcher({ type: ShrinkActionKind.SHRINKLEFTPANEL })
                    : actiondispatcher({ type: ShrinkActionKind.EXPANDLEFTPANEL });
                }}
                size='small'
              >
                {!shrinkState.shrinkleftpanel ? <ChevronLeftOutlinedIcon /> : <ChevronRightOutlinedIcon />}
              </IconButton>
            </div>
          </div>
          <CustomTabPanel innerDivClassName='tw-h-full' value={currentTab} index={0}>
            <div className='tw-h-[73dvh]'>
              <div className='tw-border-b-2 tw-p-2 tw-border-b-[#ffffff12]'>
                <LanguageDropDown
                  languagestoskip={problemInfo?.languagestoskip ?? ([] as number[])}
                  label='supported language'
                  language={langauge}
                  handleChange={handleChange}
                />
              </div>
              <Editor
                theme={colorMode === 'light' ? 'mylightTheme' : 'mydarkTheme'}
                language={supportedLanguages[langauge].toLowerCase()}
                value={code[langauge]}
                className={`tw-max-h-full tw-overflow-x-auto tw-max-w-dvw`}
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
                options={{
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  minimap: { enabled: false },
                }}
                onChange={(changedcode) => {
                  const storedCode = localStorage.getItem(`${problemname?.slice(0, problemname.length - 1)}`);
                  let cachecode = JSON.parse(storedCode ?? `{}`);
                  if (changedcode) {
                    localStorage.setItem(
                      `${problemname?.slice(0, problemname.length - 1)}`,
                      JSON.stringify({
                        ...cachecode,
                        [langauge]: changedcode,
                      })
                    );
                    setCode((prev) => {
                      const copy = { ...prev };
                      if (copy[langauge]) {
                        copy[langauge] = changedcode;
                      }
                      return copy;
                    });
                  }
                }}
              />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={1}>
            {(submissionStatusLoading && isSumbitted) || submissionStatusInprocess ? (
              <Stack className='tw-h-[75dvh]' spacing={2}>
                <SkeletonResultsLoader />
              </Stack>
            ) : !submissionStatusLoading && submissionStatusError ? (
              <div className='tw-h-[75dvh]' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2'>Some Error Occurred Please Try Again</Typography>
              </div>
            ) : !isSumbitted && !problemRunStatus.length ? (
              <div className='tw-h-[75dvh]' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2'>You must run your code first</Typography>
              </div>
            ) : problemRunStatus.length ? (
              <Stack spacing={2} className='tw-h-[75dvh]'>
                <Tabs
                  className={colorMode === 'dark' ? 'tw-text-white' : ''}
                  value={submissionTab}
                  onChange={handleSubmissionTabChange}
                >
                  {problemRunStatus.map((s, i) => (
                    <Tab
                      key={i}
                      className={colorMode === 'dark' ? 'tw-text-white min-w-12' : 'min-w-12'}
                      label={
                        <div className='tw-flex tw-gap-1 tw-items-center'>
                          <FiberManualRecordIcon
                            color={s.status.description === 'Accepted' ? 'success' : 'error'}
                            sx={{ fontSize: '0.7em' }}
                          />
                          <span>{`Case ${i + 1}`}</span>
                        </div>
                      }
                      {...a11yProps(i)}
                    ></Tab>
                  ))}
                </Tabs>
                {problemInfo?.metadata.variables_names != undefined
                  ? problemRunStatus.map((s, i) => {
                      const inputvalues = s.stdin.split('\n');
                      return (
                        <CustomTabPanel index={i} key={`language${s.language_id}`} value={submissionTab}>
                          <Stack>
                            {Object.values(problemInfo?.metadata.variables_names).map((l, j) => (
                              <Stack key={`input${j}`}>
                                <Typography className='tw-p-2' color='primary'>
                                  {l} =
                                </Typography>
                                <Typography
                                  variant='body1'
                                  className='tw-p-2'
                                  sx={{ backgroundColor: '#ECECEC' }}
                                  bgcolor={'Background'}
                                >
                                  {inputvalues[j]}
                                </Typography>
                              </Stack>
                            ))}
                            <Typography className='tw-p-2' color='primary'>
                              Output
                            </Typography>
                            <Typography sx={{ backgroundColor: '#ECECEC' }} className='tw-p-2'>
                              {s.stdout}
                            </Typography>
                            <Typography className='tw-p-2' color='primary'>
                              Expected
                            </Typography>
                            <Typography sx={{ backgroundColor: '#ECECEC' }} className='tw-p-2'>
                              {s.expected_output}
                            </Typography>
                          </Stack>
                        </CustomTabPanel>
                      );
                    })
                  : null}
              </Stack>
            ) : (
              <SkeletonResultsLoader />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={2}>
            {problemSubmissionLoading ? (
              <Stack className='tw-h-[75dvh]' spacing={2}>
                <SkeletonResultsLoader />
              </Stack>
            ) : problemSubmissionStatus === 'Accepted' ? (
              <Stack spacing={2} className='tw-h-[75dvh]'>
                <div className='tw-flex tw-justify-between tw-items-center'>
                  <Typography color='success' variant='h5'>
                    Accepted
                  </Typography>
                  <Typography>
                    Passed Test Cases {problemsuccessCount}/{problemInfo?.testCases.length}
                  </Typography>
                </div>
                <div>
                  <Typography>You have successfully completed this problem!</Typography>
                </div>
              </Stack>
            ) : problemSubmissionStatus === 'Rejected' ? (
              <Stack spacing={2} className='tw-h-[75dvh]'>
                <div className='tw-flex tw-justify-between tw-items-center'>
                  <Typography color='error' variant='h4'>
                    Rejected
                  </Typography>
                  <Typography>
                    Passed Test Cases {problemsuccessCount}/{problemInfo?.testCases.length}
                  </Typography>
                </div>
                <div>
                  <Typography>You have successfully completed this problem!</Typography>
                </div>
              </Stack>
            ) : (
              <Stack spacing={2} className='tw-h-[75dvh]'></Stack>
            )}
          </CustomTabPanel>
          <div className='tw-flex tw-justify-between tw-items-center'>
            <div>Saved</div>
            <div className='tw-flex tw-gap-2'>
              <Button
                variant='outlined'
                color='primary'
                className={`${colorMode === 'light' ? 'tw-bg-[#ECECEC]' : 'tw-bg-[#24292e] tw-text-white'}`}
                onClick={onClickHandler}
              >
                Run
              </Button>
              <Button variant='contained' color='success' onClick={onSubmitHandler}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
