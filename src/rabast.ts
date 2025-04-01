import { Context } from "ciaplu";
import path from 'path';
import { Route } from "./route";
import { Resolver } from "./resolver";
import { HttpResponse } from "./responses/httpresponse";
import { NotFound } from "./responses/http/notfound";
import { NullResponse } from "./responses/nullresponse";
import http, { IncomingMessage, ServerResponse } from 'http';
import { RabastParameters } from "./rabastparameters";
import { HttpRequest } from "./responses/httprequest";
import { RabastMatcher } from "./rabastmatcher";

export class Rabast implements Resolver {
  private _matcher: RabastMatcher = new RabastMatcher({});

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse | null> {
    this._matcher.context = new Context(request);

    const route: Route = await this._matcher;

    const url = path.posix.normalize(this._matcher.context.value.url);

    const response: HttpResponse | null = await route.handle({
      ...this._matcher.context.value,
      url,
    }, root);

    if (response instanceof NullResponse) {
      return new NotFound(`Route ${request.method}:${request.url} not found`);
    }

    return response;
  }

  async listen(parameters: RabastParameters, callback: () => void = () => {}) {
    const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
      let body = '';
      
      request.on('data', chunk => {
        body += chunk.toString();
      });

      request.on('end', async () => {
        const httpRequest: HttpRequest = {
          url: request.url,
          method: request.method,
          body: body ? JSON.parse(body) : undefined,
          incomingMessage: request,
          serverResponse: response,
        };

        const result: HttpResponse = await this.handle(httpRequest);

        response.statusCode = result.statusCode;
        response.setHeader('Content-Type', 'application/json');

        response.end(result.body);
      });
    });

    server.listen(parameters.port, parameters.host);

    server.on('listening', () => callback());
  }

  async inject(request: any) {
    return await this.handle(request);
  }

  routing(handler: () => Promise<any> | any) {
    this._matcher.otherwise(handler);

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

