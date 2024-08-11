import { Box } from '@mui/material';
import Layout from '../../UI/Layout';
import SignUpForm from './Form';

export default function SignUp() {
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SignUpForm></SignUpForm>
      </Box>
    </Layout>
  );
}
