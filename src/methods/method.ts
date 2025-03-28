import { Matcher } from "ciaplu";
import path from 'path';
import { Resolver } from "../resolver";
import { HttpRequest } from "../responses/httprequest";
import { HttpResponse } from "../responses/httpresponse";
import { Ok } from "../responses/http/ok";
import { NullResponse } from "../responses/nullresponse";

export class Method extends Matcher<string> implements Resolver {
  private _name: string;
  private _path: string;

  constructor(_name: string = '', _path: string = '') {
    super(_path);

    this._name = _name;
    this._path = path.posix.normalize(_path);
  }

  async handle(request: HttpRequest, root: string = ''): Promise<HttpResponse | null> {
    const currentPath = path.posix.join(root, this.path);

    if (currentPath === request.url && this.name === request.method) {
      const response = await this;

      return new Ok(response);
    }

    return new NullResponse();
  }

  get path() {
    return this._path;
  }

  get name() {
    return this._name;
  }
}
