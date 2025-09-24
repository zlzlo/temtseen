declare module "openai" {
  export interface ResponsesClient {
    create(params: any): Promise<any>;
  }

  export interface OpenAIConfig {
    apiKey?: string;
  }

  export default class OpenAI {
    constructor(config?: OpenAIConfig);
    responses: ResponsesClient;
  }
}
