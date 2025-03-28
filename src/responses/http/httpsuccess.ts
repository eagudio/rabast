import { HttpResponse } from "../httpresponse";

export abstract class HttpSuccess implements HttpResponse {
  private _statusCode: number;
  private _body: any;

  constructor(statusCode: number, body: any) {
    this._statusCode = statusCode;
    this._body = body;
  }

  get statusCode() {
    return this._statusCode;
  }

  get body() {
    return this._body;
  }
}
