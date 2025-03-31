import { Matcher } from "ciaplu";
import { Resolver } from "../resolver";
import { HttpRequest } from "../responses/httprequest";
import { HttpResponse } from "../responses/httpresponse";
import { Ok } from "../responses/http/ok";
import { NullResponse } from "../responses/nullresponse";
import { HttpSuccess } from "../responses/http/httpsuccess";
import { HttpError } from "../responses/http/httperror";

export class Method implements Resolver {
  private _name: string;
  private _matcher: Matcher<any>;
  private _requestExtractor: (request?: HttpRequest) => any;

  constructor(_name: string = '') {
    this._name = _name;
    this._matcher = new Matcher<any>({});

    this._requestExtractor = () => {};
    this.extracting(async () => await this._requestExtractor());
  }

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse | null> {
    this._requestExtractor = () => Promise.resolve(request);

    if (root === request.url && this.name === request.method) {
      const response = await this._matcher;

      if (response instanceof HttpError || response instanceof HttpSuccess || response instanceof NullResponse) {
        return response;
      }

      return new Ok(response);
    }

    return new NullResponse();
  }

  reply(handler: () => Promise<any> | any) {
    this._matcher.otherwise(handler);

    return this;
  }

  get name() {
    return this._name;
  }

  with(value: any, handler: () => Promise<any> | any) {
    this._matcher.with(value, handler);

    return this;
  }

  withType<U>(value: new (...args: any[]) => U, handler: () => Promise<any> | any) {
    this._matcher.withType(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: () => Promise<any> | any) {
    this._matcher.when(matcher, handler);

    return this;
  }

  not() {
    this._matcher.not();

    return this;
  }

  yet() {
    this._matcher.yet();

    return this;
  }
  
  extracting(handler: (state: any) => Promise<any> | any) {
    this._matcher.extracting(handler);

    return this;
  }

  test(matcher: (value1: any, value2: any) => Promise<boolean> | boolean) {
    this._matcher.test(matcher);

    return this;
  }

  otherwise(handler: () => Promise<any> | any) {
    this._matcher.otherwise(handler);

    return this;
  }

  one() {
    this._matcher.one();

    return this;
  }

  all() {
    this._matcher.all();

    return this;
  }

  return() {
    this._matcher.return();

    return this;
  }
}
