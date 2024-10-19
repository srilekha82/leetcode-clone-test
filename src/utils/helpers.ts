export default function transformInput(
  userInput: string,
  judgeTemplate: string,
  variableNames: Record<string, string>,
  variableTypes: Record<string, string>
) {
  const regexPatterns = {
    array: (varName: string) => new RegExp(`${varName}\\s*=\\s*\\[(.*?)\\]`),
    int: (varName: string) => new RegExp(`${varName}\\s*=\\s*(\\d+)`),
    string: (varName: string) => new RegExp(`${varName}\\s*=\\s*['"](.*?)['"]`),
  };

  let extractedValues: Record<string, string> = {};

  // Extract values from userInput based on variable types and names
  for (let varName in variableNames) {
    const varType: string = variableTypes[varName];
    // @ts-ignore
    const regexPattern = regexPatterns[varType](variableNames[varName]);
    const match = userInput.match(regexPattern);
    if (match) {
      if (varType === 'array') {
        extractedValues[varName] = match[1]
          .split(',')
          .map((s: string) => s.trim().replace(/['"]/g, ''))
          .join(',');
      } else {
        extractedValues[varName] = match[1];
      }
    }
  }

  // Replace placeholders in judgeTemplate sequentially for each variable
  let transformedInput = judgeTemplate;
  for (let key in extractedValues) {
    transformedInput = transformedInput.replace(`{${variableTypes[key]}}`, extractedValues[key]);
  }

  return transformedInput;
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
