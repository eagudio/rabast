import { Context, Matcher } from "ciaplu";
import { Resolver } from "../resolver";
import { HttpRequest } from "../responses/httprequest";
import { HttpResponse } from "../responses/httpresponse";
import { Ok } from "../responses/http/ok";
import { NullResponse } from "../responses/nullresponse";
import { HttpSuccess } from "../responses/http/httpsuccess";
import { HttpError } from "../responses/http/httperror";
import { RabastMatcher } from "../rabastmatcher";

export class Method implements Resolver {
  private _name: string;
  private _path: string;
  private _matcher: RabastMatcher;
  private _requestExtractor: (request?: HttpRequest) => any;

  constructor(_name: string = '', _path: string = '') {
    this._name = _name;
    this._path = _path;
    this._matcher = new RabastMatcher({});

    this._requestExtractor = () => {};
    this.extracting(async () => await this._requestExtractor());
  }

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse | null> {
    this._matcher.context = new Context(request);

    const fullPath = root + this._path;
    const [urlPath] = request.url.split('?');

    if (this.matchUrl(fullPath, urlPath) && this.name === request.method) {
      const params = this.extractParams(fullPath, urlPath);
      const query = this.extractQueryParams(request.url);
      
      request.params = params;
      request.query = query;
      
      this._requestExtractor = () => Promise.resolve(request);
      const response = await this._matcher;

      if (response instanceof HttpError || response instanceof HttpSuccess || response instanceof NullResponse) {
        return response;
      }

      return new Ok(response);
    }

    return new NullResponse();
  }

  reply(handler: (value: any) => Promise<any> | any) {
    this._matcher.otherwise(handler);

    return this;
  }

  get name() {
    return this._name;
  }

  with(value: any, handler: (value: any) => Promise<any> | any) {
    this._matcher.with(value, handler);

    return this;
  }

  withType<U>(value: new (...args: any[]) => U, handler: (value: U) => Promise<any> | any) {
    this._matcher.withType(value, handler);

    return this;
  }

  when(matcher: (value: any) => Promise<boolean> | boolean, handler: (value: any) => Promise<any> | any) {
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

  otherwise(handler: (value: any) => Promise<any> | any) {
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

  private extractParams(path: string, url: string): { [key: string]: string } {
    const pathParts = path.split('/');
    const urlParts = url.split('/');
    const params: { [key: string]: string } = {};

    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].startsWith(':')) {
        const paramName = pathParts[i].substring(1);
        params[paramName] = urlParts[i];
      }
    }

    return params;
  }

  private matchUrl(path: string, url: string): boolean {
    const pathParts = path.split('/');
    const urlParts = url.split('/');

    if (pathParts.length !== urlParts.length) {
      return false;
    }

    for (let i = 0; i < pathParts.length; i++) {
      if (!pathParts[i].startsWith(':') && pathParts[i] !== urlParts[i]) {
        return false;
      }
    }

    return true;
  }

  private extractQueryParams(url: string): { [key: string]: string } {
    const query: { [key: string]: string } = {};
    const [, queryString] = url.split('?');
    
    if (!queryString) {
      return query;
    }

    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      query[key] = value;
    });

    return query;
  }
}
