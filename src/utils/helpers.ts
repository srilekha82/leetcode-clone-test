import { problemsubmission, submission } from './types';

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function getResult(batchwiseresults: submission[]) {
  let successcount = 0;

  for (let index = 0; index < batchwiseresults.length; index++) {
    const result = batchwiseresults[index];
    if (result.status.description != 'Accepted') {
      return { status: false, successcount };
    }
    successcount++;
  }
  return { status: true, successcount };
}
export function isAccepted(problemId: string, submissions: problemsubmission[]) {
  const userSubmissions = [...new Set(submissions.filter((s) => s.status === 'Accepted').map((s) => s.problemId))];
  return userSubmissions.includes(problemId);
}
export function isRejected(problemId: string, submissions: problemsubmission[]) {
  const userSubmissions = [...new Set(submissions.filter((s) => s.status === 'Wrong Answer').map((s) => s.problemId))];
  return userSubmissions.includes(problemId);
}
export const getGridColumnStyles = (
  isPanelExpanded: boolean,
  isOtherPanelShrunk: boolean,
  isThisPanelShrunk: boolean
) => {
  if (isPanelExpanded || isOtherPanelShrunk) {
    return '1 / -1'; 
  } else if (isThisPanelShrunk) {
    return 'auto'; 
  }
  return 'auto'; 
};

export const getRandomIndex = (length: number) => {
  return Math.floor(Math.random() * 10) % length;
};

export const getGridTemplateColumns = (size1: number, size2: number) => {
  const halfSize = Math.floor(size1 / 2);
  const floredSizeTwp = Math.floor(size2);
  return `${halfSize - 1}% ${100 - (halfSize + floredSizeTwp) + 2}% ${floredSizeTwp - 1}%`;
};
