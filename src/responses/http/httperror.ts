import { HttpResponse } from "../httpresponse";

export abstract class HttpError implements HttpResponse {
  private _statusCode: number;
  private _message: string;
  private _error: string;

  constructor(statusCode: number, message: string, error: string) {
    this._statusCode = statusCode;
    this._message = message;
    this._error = error;
  }

  get statusCode() {
    return this._statusCode;
  }

  get message() {
    return this._message;
  }

  get error() {
    return this._error;
  }
}
