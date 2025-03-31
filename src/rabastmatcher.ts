import { Context, Matcher } from "ciaplu";

export class RabastMatcher extends Matcher<any> {
  get context() {
    return this._context;
  }

  set context(context: Context) {
    this._context = context;
  }
}