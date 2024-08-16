import api from '../API/Index';
import { commonresponse } from '../utils/types';
const signUp = async (email: string, password: string) => {
  try {
    const response = await api.post<commonresponse>('users/createUser', { email, password });
    if (response.data.status === 'Failure') {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default signUp;
