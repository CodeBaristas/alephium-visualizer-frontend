// utils/apiClient.ts

import {DefaultApi, Configuration} from "@/client";

class ApiClient {
  private static instance: DefaultApi;
  public static getInstance(): DefaultApi {
    if (!ApiClient.instance) {
      const config = new Configuration({
        apiKey: process.env.API_KEY,
        basePath: process.env.NEXT_PUBLIC_API_BASE_PATH,
      });
      ApiClient.instance = new DefaultApi(config);
    }
    return ApiClient.instance;
  }
}
export const apiClient = ApiClient.getInstance();
