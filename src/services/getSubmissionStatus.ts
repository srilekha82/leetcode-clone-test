import judgeapi from '../API/judge0';

export default async function getStatus(submissionId: string) {
  try {
    const response = await judgeapi.get(`/submissions/${submissionId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
