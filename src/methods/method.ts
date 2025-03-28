import { Matcher } from "ciaplu";
import path from 'path';

export class Method extends Matcher<string> {
  private _path: string;

  constructor(_path: string = '') {
    super(_path);

    this._path = path.posix.normalize(_path);
  }

  get path() {
    return this._path;
  }
}
