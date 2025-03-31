export interface HttpRequest {
  url: string;
  method: string;
  body?: any;
  params?: { [key: string]: string };
  query?: { [key: string]: string };
}
