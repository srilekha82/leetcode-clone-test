import { Box, Chip, Stack, Typography } from '@mui/material';
import { Problem } from '../../../utils/types';
const ProblemDescription: React.FC<{
  problem: Problem | null;
  serialNo?: string;
  colorMode?: string;
}> = ({ problem, serialNo }) => {
  return (
    <Stack spacing={8} className='tw-p-2'>
      <Box>
        <Typography variant='h5'>
          {serialNo}.{problem?.title}
        </Typography>
        <div className='tw-mt-2'>
          <Chip
            label={problem?.difficulty}
            color={problem?.difficulty === 'easy' ? 'info' : problem?.difficulty === 'hard' ? 'error' : 'warning'}
          />
        </div>
        <div className='tw-mt-2'>
          <Typography variant='subtitle1'>{problem?.description}</Typography>
        </div>
      </Box>
      <Box>
        <Typography variant='h5'>Examples</Typography>
        <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
          <Typography variant='h6'>Input :</Typography>
          <Typography variant='body2'>{problem?.sampleInput}</Typography>
        </div>
        <div className='tw-flex tw-gap-2 tw-items-center tw-justify-start'>
          <Typography variant='h6'>Output:</Typography>
          <Typography variant='body2'>{problem?.sampleOutput}</Typography>
        </div>
      </Box>
    </Stack>
  );
};
export default ProblemDescription;
