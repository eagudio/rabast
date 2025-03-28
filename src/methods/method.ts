import { Matcher } from "ciaplu";
import path from 'path';
import { Resolver } from "../resolver";
import { HttpRequest } from "../httprequest";
import { HttpResponse } from "../httpresponse";

export class Method extends Matcher<string> implements Resolver {
  private _name: string;
  private _path: string;

  constructor(_name: string = '', _path: string = '') {
    super(_path);

    this._name = _name;
    this._path = path.posix.normalize(_path);
  }

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse> {
    const currentPath = path.posix.join(root, this.path);

    if (currentPath === request.url && this.name === request.method) {
      const response = await this;

      return {
        status: 200,
        body: response,
      };
    }

    return;
  }

  get path() {
    return this._path;
  }

  get name() {
    return this._name;
  }
}
