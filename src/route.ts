import { HttpRequest } from "./responses/httprequest";
import { Method } from "./methods/method";
import path from 'path';
import { Rabast } from "./rabast";
import { Resolver } from "./resolver";
import { HttpResponse } from "./responses/httpresponse";
import { NullResponse } from "./responses/nullresponse";

export class Route implements Resolver {
  private _route: string;
  private _methods: Method[] | Route[] | Rabast[] = [];

  constructor(_route: string, ...methods: any[]) {
    this._route = _route;
    this._methods = methods;
  }

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse | null> {
    for (const method of this._methods) {
      const currentPath = path.posix.join(root, this._route);

      const response: HttpResponse | null = await method.handle(request, currentPath);

      if (response instanceof NullResponse) {
        continue;
      }

      return response;
    }

    return new NullResponse();
  }

  get route() {
    return this._route;
  }
}
