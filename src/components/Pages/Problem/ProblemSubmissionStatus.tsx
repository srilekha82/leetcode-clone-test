import { Stack, Typography } from '@mui/material';

export default function ProblemSubmissionStatus({
  successCount,
  totalTestCases,
  problemSubmissionStatus,
}: {
  successCount: number;
  totalTestCases: number | undefined;
  problemSubmissionStatus: '' | 'Accepted' | 'Rejected';
}) {
  return (
    <Stack spacing={2} className='tw-h-[75dvh]'>
      <div className='tw-flex tw-justify-between tw-items-center'>
        <Typography color={problemSubmissionStatus === 'Accepted' ? 'success' : 'error'} variant='h4'>
          {problemSubmissionStatus}
        </Typography>
        <Typography>
          Passed Test Cases {successCount}/{totalTestCases}
        </Typography>
      </div>
      <div>
        <Typography>You have successfully completed this problem!</Typography>
      </div>
    </Stack>
  );
}
