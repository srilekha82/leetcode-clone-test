import judgeapi from '../API/judge0';
async function batchwiseSubmission<T>(problems: T) {
  try {
    const response = await judgeapi.post(`/submissions/batch`, {
      submissions: problems,
    });
    if (response.data.status === 'Failure') {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export default batchwiseSubmission;
