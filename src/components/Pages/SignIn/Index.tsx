import { Box } from '@mui/material';
import Layout from '../../UI/Layout';
import LoginForm from './Form';

function SignIn() {
  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginForm></LoginForm>
      </Box>
    </Layout>
  );
}

export default SignIn;
