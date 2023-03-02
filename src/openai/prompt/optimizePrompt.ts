import { getActiveTextEditorValue } from '../../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../../utils/getActiveTextLanguageId'

export async function optimizePrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Please optimize the following code by reducing the number of operations performed during execution, without changing the functionality of the code. Please provide comments for any lines that require explanation:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Do not provide additional explanation or the original code. Instead, we require the optimised code with comments about the source code lines that have been optimised.`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}
