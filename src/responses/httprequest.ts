import { IncomingMessage, ServerResponse } from "http";

export interface HttpRequest {
  url: string;
  method: string;
  body?: any;
  params?: { [key: string]: string };
  query?: { [key: string]: string };
  incomingMessage?: IncomingMessage;
  serverResponse?: ServerResponse;
}
