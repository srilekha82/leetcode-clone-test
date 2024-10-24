import { useNavigate, useParams } from 'react-router';
import { Editor, Monaco } from '@monaco-editor/react';
import * as monaco from '@monaco-editor/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import getProblem from '../../../services/getProblem';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Layout from '../../UI/Layout';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import LanguageDropDown from './LanguageDropDown';
import { darktheme, lighttheme, supportedLanguages, theme } from '../../../constants/Index';
import { useAuthSlice } from '../../../store/authslice/auth';
import submitCode from '../../../services/sumbitCode';
import getStatus from '../../../services/getSubmissionStatus';
import transformInput, { a11yProps, getResult } from '../../../utils/helpers';
import CustomTabPanel from '../../UI/TabPanel';
import { problemsubmissionstatus, submission } from '../../../utils/types';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useUserSlice } from '../../../store/user';
import SkeletonResultsLoader from '../../UI/SkeletonResultsLoader';
import addSubmission from '../../../services/addSubmission';
import batchwiseSubmission from '../../../services/batchwiseSubmission';
import ProblemSubmissions from './ProblemSubmissions';

export default function Problem() {
  const { problemname } = useParams();
  const [open, setOpen] = useState<boolean>(true);
  const [langauge, setLangauge] = useState<number>(93);
  const { colorMode } = usethemeUtils();
  const isLogedIn = useAuthSlice((state) => state.isLogedIn);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [isSumbitted, setIsSumbitted] = useState<boolean>(false);
  const [submissionTab, setSubmissionTab] = useState<number>(0);
  const user = useUserSlice((state) => state.user);
  const [submissionStatusLoading, setSubmissionStatusLoading] = useState<boolean>(false);
  const [submissionStatusError, setSubmissionStatusError] = useState<boolean>(false);
  const [submissionStatusInprocess, setSubmissionStatusInProcess] = useState<boolean>(false);
  const [problemSubmissionLoading, setProblemSubmissionLoading] = useState<boolean>(false);
  const [problemSubmissionStatus, setProblemSubmissionStatus] = useState<'Accepted' | 'Rejected' | ''>('');
  const [problemsuccessCount, setSuccessCount] = useState<number>(0);
  const [leftTab, setLeftTab] = useState<number>(0);
  const [problemRunStatus, setproblemRunStatus] = useState<submission[]>([]);
  const [problemsubmissions, setProblemSubmissions] = useState<problemsubmissionstatus[]>(user?.submissions ?? []);

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
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['problem', problemname],
    queryFn: () => {
      return getProblem(problemname?.slice(0, problemname.length - 1) as string);
    },
    refetchOnWindowFocus: false,
  });
  const { mutateAsync } = useMutation({
    mutationKey: ['codesubmission'],
    mutationFn: submitCode,
  });
  const { mutateAsync: updateSubmitMutateAsync } = useMutation({
    mutationKey: ['updatesubmission'],
    mutationFn: addSubmission,
  });

  const editorRef = useRef(null);

  useEffect(() => {
    monaco.loader.init().then((monacoinstance: Monaco) => {
      monacoinstance.editor.defineTheme('mylightTheme', lighttheme as theme);
      monacoinstance.editor.defineTheme('mydarkTheme', darktheme as theme);
    });
    return ()=>{
      setProblemSubmissions([])
    }
  }, [colorMode]);

  if (isLoading) {
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

  if (isError) {
    return (
      <Layout>
        <Alert className='tw-mx-auto' severity='error'>
          {error.message}
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
      //@ts-ignore
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

    if (editorRef.current && data) {
      const output = data.data.sampleOutput;
      // @ts-ignore
      const code = `${data.data.imports.find((s) => s.lang_id == langauge)?.code} \n${editorRef.current.getValue()} \n${data?.data.systemCode.find((s) => s.lang_id == langauge)?.code}`;
      try {
        const input = transformInput(
          data?.data.sampleInput as string,
          data?.data.metadata.judge_input_template as string,
          data?.data.metadata.variables_names as Record<string, string>,
          data?.data.metadata.variables_types as Record<string, string>
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
    if (editorRef.current && data) {
      const submissionbatch = [];
      const testcases = data.data.testCases;
      // @ts-ignore
      const code = `${data.data.imports.find((s) => s.lang_id == langauge)?.code} \n ${editorRef.current.getValue()} \n ${data?.data.systemCode.find((s) => s.lang_id == langauge)?.code}`;
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
        //@ts-ignore
        const batchwiseresponsepromises = [];
        batchwiseresponse?.forEach((submission) => {
          batchwiseresponsepromises.push(getSubmission(submission.token));
        });
        //@ts-ignore
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
    <Layout showFooter={false}>
      <Container maxWidth='xl' className='tw-flex tw-gap-2 '>
        <div
          className={`tw-flex-1 tw-w-45 tw-p-2 tw-border-2 tw-rounded-lg`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderWidth: '2px',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
          }}
        >
          <Tabs value={leftTab} onChange={handleLeftTabChange}>
            <Tab label='Description' {...a11yProps(0)}></Tab>
            <Tab label='Submissions' {...a11yProps(1)}></Tab>
          </Tabs>
          <CustomTabPanel value={leftTab} index={0}>
            <Stack spacing={8} className='tw-p-2'>
              <Box>
                <Typography variant='h5'>
                  {problemname?.slice(problemname.length - 1)}. {data?.data.title}
                </Typography>
                <div className='tw-mt-2'>
                  <Chip
                    label={data?.data.difficulty}
                    color={
                      data?.data.difficulty === 'easy' ? 'info' : data?.data.difficulty === 'hard' ? 'error' : 'warning'
                    }
                  />
                </div>
                <div className='tw-mt-2'>
                  <Typography variant='subtitle1'>{data?.data.description}</Typography>
                </div>
              </Box>
              <Box>
                <Typography variant='h5'>Examples</Typography>
                <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                  <Typography variant='h6'>Input :</Typography>
                  <Typography variant='body2'>{data?.data.sampleInput}</Typography>
                </div>
                <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
                  <Typography variant='h6'>Output:</Typography>
                  <Typography variant='body2'>{data?.data.sampleOutput}</Typography>
                </div>
              </Box>
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={leftTab} index={1}>
            {problemsubmissions.length ? <ProblemSubmissions data={problemsubmissions}></ProblemSubmissions> : null}
          </CustomTabPanel>
        </div>
        <div
          className={`tw-flex-1 tw-w-45 tw-p-2 tw-border-2 tw-rounded-lg`}
          style={{
            backgroundColor: colorMode === 'light' ? 'white' : '#24292e',
            borderWidth: '2px',
            borderColor: colorMode === 'light' ? '#c5c9cb' : '#ffffff12',
          }}
        >
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label='Code' {...a11yProps(0)}></Tab>
            <Tab label='Test Results' {...a11yProps(1)}></Tab>
            <Tab label='Output' {...a11yProps(2)}></Tab>
          </Tabs>
          <CustomTabPanel value={currentTab} index={0}>
            <>
              <div className='tw-border-b-2 tw-p-2 tw-border-b-[#ffffff12]'>
                <LanguageDropDown
                  languagestoskip={data?.data.languagestoskip ?? ([] as number[])}
                  label='supported language'
                  language={langauge}
                  handleChange={handleChange}
                />
              </div>
              <Editor
                theme={colorMode === 'light' ? 'mylightTheme' : 'mydarkTheme'}
                height='75dvh'
                language={supportedLanguages[langauge].toLowerCase()}
                value={data?.data.starterCode.find((s) => s.lang_id == langauge)?.code}
                className='tw-max-h-[75dvh] tw-overflow-x-auto'
                onMount={(editor) => {
                  editorRef.current = editor;
                }}
              />
            </>
          </CustomTabPanel>
          <CustomTabPanel value={currentTab} index={1}>
            {(submissionStatusLoading && isSumbitted) || submissionStatusInprocess ? (
              <Stack className='tw-h-[75dvh]' spacing={2}>
                <SkeletonResultsLoader />
              </Stack>
            ) : !isSumbitted && !problemRunStatus.length ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '75dvh' }}>
                <Typography variant='body2'>You must run your code first</Typography>
              </div>
            ) : problemRunStatus.length ? (
              <Stack spacing={2} className='tw-h-[75dvh]'>
                <Tabs value={submissionTab} onChange={handleSubmissionTabChange}>
                  {problemRunStatus.map((s, i) => (
                    <Tab
                      key={i}
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
                {data?.data.metadata.variables_names != undefined
                  ? problemRunStatus.map((s, i) => {
                      const inputvalues = s.stdin.split('\n');
                      return (
                        <CustomTabPanel index={i} key={`language${s.language_id}`} value={submissionTab}>
                          <Stack>
                            {Object.values(data?.data.metadata.variables_names).map((l, j) => (
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
                    Passed Test Cases {problemsuccessCount}/{data?.data.testCases.length}
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
                    Passed Test Cases {problemsuccessCount}/{data?.data.testCases.length}
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
      </Container>
    </Layout>
  );
}
