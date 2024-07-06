import type z from "zod";
import axios, { type AxiosRequestConfig } from "axios";

export async function safeFetch<T>({
  url,
  init,
  schema,
}: {
  url: string;
  init?: AxiosRequestConfig;
  schema: z.ZodType<T>;
  parseJson?: boolean;
}): Promise<T> {
  // const response = await fetch(input, init);

  const response = await axios
    .request({ url, ...init })
    .then((res) => res.data)
    .catch((err) => {
      throw newHTTPError(err.message, err.response, init?.method);
    });

  // const json = await response.json().catch(() => {
  //   throw newHTTPError("Invalid JSON", response, init?.method);
  // });

  const result = schema.safeParse(response);

  if (!result.success) {
    throw newHTTPError("Invalid response schema", response, init?.method);
  }

  return result.data;
}

function newHTTPError(reason: string, response: Response, method?: string) {
  const text = response.text().catch(() => null);
  const message = `HTTPError: ${reason} ${method ?? ""} ${
    response.url
  } ${text}`;

  console.error(`[HTTPError] ${message} ${response.url} ${response.status}`);

  return new HTTPError(response.status, message);
}

export class HTTPError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.status = status;
  }
}
