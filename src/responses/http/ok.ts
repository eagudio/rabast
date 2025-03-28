import { HttpSuccess } from "./httpsuccess";

export class Ok extends HttpSuccess {
  constructor(body: any) {
    super(200, body);
  }
};
