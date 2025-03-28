import { Method } from "./methods/method";
import path from 'path';

export class Route {
  private _route: string;
  private _methods: Method[] | Route[];

  constructor(_route: string, ...methods: any[]) {
    this._route = _route;
    this._methods = methods;
  }

  async resolve(url: string, root: string = '') {
    for (const method of this._methods) {
      if (method instanceof Method) {
        const currentPath = path.posix.join(root, this._route, method.path);

        if (currentPath === url) {
          const response = await method;

          return response;
        }
      } else if (method instanceof Route) {
        const currentPath = path.posix.join(root, this._route);

        const response = await method.resolve(url, currentPath);

        if (response) {
          return response;
        }
      }
    }

    throw new Error('Route not found');
  }

  get route() {
    return this._route;
  }
}
