import judgeapi from '../API/judge0';

export default async function getStatus(submissionId: string) {
  try {
    const response = await judgeapi.get(
      `/submissions/${submissionId}?fields=stdout,stderr,language_id,stdin,status,expected_output`
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
