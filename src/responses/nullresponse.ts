import { HttpResponse } from "./httpresponse";

export class NullResponse implements HttpResponse {
  private _statusCode: number;
  private _body: any;

  constructor() {
    this._statusCode = 0;
    this._body = '';
  }
  
  get statusCode() {
    return this._statusCode;
  }

  get body() {
    return this._body;
  }
}
