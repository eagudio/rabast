export abstract class HttpResponse {
  abstract statusCode: number;
  abstract body?: any;
}
