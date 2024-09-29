import api from '../API/Index';
import { signUpType } from '../utils/types';

const signUp = async (userinfo: {
  username: string;
  email: string;
  password: string;
  favoriteProgrammingLanguage: string;
  role:["user"]
}) => {
  try {
    const response = await api.post<signUpType>('users/createUser', userinfo);
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
