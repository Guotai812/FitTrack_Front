import { useState } from "react";

type RequestConfig = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  body?: any;
};

export default function useHttp<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function sendRequest(config: RequestConfig) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(config.url, {
        method: config.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const responseData: T = await response.json();
      setData(responseData);
      return responseData;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    data,
    error,
    isLoading,
    sendRequest,
  };
}
