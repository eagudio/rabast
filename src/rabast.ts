import { Matcher } from "ciaplu";
import path from 'path';

export class Rabast {
  private _url: string = '/';
  private _method: string = '';
  private _r: Rabast | null = null;
  private _matcher: Matcher<any>;

  constructor(url: string = '/') {
    this._matcher = new Matcher({});
    this._url = path.posix.normalize(url);
  }

  async inject(request: any) {
    const urls = [
      this._url,
      ...path.posix.normalize(path.posix.join(this._url, request.url)).split('/').filter(Boolean)
    ];
    
    const response = await this._resolveRoute(request, urls);

    return response;
  }

  private async _resolveRoute(request: any, urls: string[], index: number = 0) {
    const normalizedRoute = path.posix.normalize('/' + urls[index]);

    if (this._url === normalizedRoute && this._method === request.method && index === urls.length - 1) {
      return await this._matcher;
    }

    if (index === urls.length || this._r === null) {
      throw new Error('Route not found');
    }

    const response = await this._r._resolveRoute(request, urls, index + 1);

    return response;
  }
  
  route (path: string) {
    this._r = new Rabast(path);

    return this._r;
  }

  get() {
    this._method = 'GET';

    return this;
  }

  post() {
    this._method = 'POST';

    return this;
  }

  put() {
    this._method = 'PUT';

    return this;
  }
  
  delete() {
    this._method = 'DELETE';

    return this;
  }

  first() {
    this._matcher.first();

    return this;
  }

  any() {
    this._matcher.any();

    return this;
  }

  head() {
    this._method = 'HEAD';

    return this;
  }

  connect() {
    this._method = 'CONNECT';

    return this;
  }

  options() {
    this._method = 'OPTIONS';

    return this;
  }
  
  trace() {
    this._method = 'TRACE';

    return this;
  }

  patch() {
    this._method = 'PATCH';

    return this;
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

