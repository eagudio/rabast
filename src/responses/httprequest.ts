export abstract class HttpRequest {
  abstract url: string;
  abstract method: string;
  abstract body: any;
}
