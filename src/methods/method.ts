import { Matcher } from "ciaplu";
import path from 'path';

export class Method extends Matcher<string> {
  private _name: string;
  private _path: string;

  constructor(_name: string = '', _path: string = '') {
    super(_path);

    this._name = _name;
    this._path = path.posix.normalize(_path);
  }

  get path() {
    return this._path;
  }

  get name() {
    return this._name;
  }
}
