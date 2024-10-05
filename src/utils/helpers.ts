export default function transformInput(
  userInput: string,
  judgeTemplate: string,
  variableNames: Record<string, string>,
  variableTypes: Record<string, string>
) {
  const regexPatterns = {
    array: (varName: string) => new RegExp(`${varName} = \\[(.*?)\\]`),
    int: (varName: string) => new RegExp(`${varName} = (\\d+)`),
    string: (varName: string) => new RegExp(`${varName} = ['"](.*?)['"]`),
  };

  let extractedValues: Record<string, string> = {};

  for (let varName in variableNames) {
    const varType: string = variableTypes[varName];
    // @ts-ignore
    const regexPattern = regexPatterns[varType](variableNames[varName]);
    const match = userInput.match(regexPattern);
    if (match) {
      // @ts-ignore
      extractedValues[varName] = match[1];
    }
  }
  let transformedInput = judgeTemplate;
  for (let key in extractedValues) {
    const placeholderType = variableTypes[key];
    const placeholder = `{${placeholderType}}`;
    transformedInput = transformedInput.replace(placeholder, extractedValues[key]);
  }
  return transformedInput;
}
export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
