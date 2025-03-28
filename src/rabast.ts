import { Matcher } from "ciaplu";
import path from 'path';
import { Route } from "./route";
import { Resolver } from "./resolver";
import { HttpResponse } from "./responses/httpresponse";
import { NotFound } from "./responses/http/notfound";
import { NullResponse } from "./responses/nullresponse";

export class Rabast implements Resolver {
  private _matcher: Matcher<any> = new Matcher({});

  async handle(request: any, root: string = ''): Promise<HttpResponse | null> {
    const route: Route = await this._matcher;

    const url = path.posix.normalize(request.url);

    const response: HttpResponse | null = await route.handle({
      url,
      method: request.method,
    }, root);

    if (response instanceof NullResponse) {
      return new NotFound(`Route ${request.method}:${request.url} not found`);
    }

    return response;
  }

  async inject(request: any, root: string = '') {
    return await this.handle(request, root);
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

