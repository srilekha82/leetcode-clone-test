import  { protectedapi } from '../API/Index';
import { getProblemsType } from '../utils/types';
const getProblems = async () => {
  try {
    const response = await protectedapi.get<getProblemsType>('/api/problems');
    if (response.data.status === 'Failure') {
      throw new Error(response.data.error);
    }
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default getProblems;
