import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationSettingService, featureVerifyApiKey } from '@app/services'
import { StatusBarServiceProvider, setFeatureFlag } from '@app/apis/vscode'
import { errorHandler } from './errorHandler'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'
import { createErrorNotification, createInfoNotification } from '@app/apis/node'

export async function validateApiKey() {
  try {
    await verifyApiKey()
  } catch (error) {
    createErrorNotification(error)
  }
}

export async function verifyApiKey(): Promise<boolean> {
  try {
    if (!featureVerifyApiKey()) return true

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'loading~spin',
      '- verify authentication'
    )
    const configuration = new Configuration({
      apiKey: await ConfigurationSettingService.instance.getApiKey(),
      basePath: ConfigurationSettingService.instance.baseUrl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels(
      await ConfigurationSettingService.instance.getRequestConfig()
    )
    if (response.status === 200) {
      setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, true)
      createInfoNotification('verifyApiKey success')
      StatusBarServiceProvider.instance.showStatusBarInformation(
        'vscode-openai',
        ''
      )
      return true
    }
  } catch (error: any) {
    errorHandler(error)
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
  }
  return false
}