import { HttpError } from "./httperror";

export class Unauthorized extends HttpError {
  constructor(message: string) {
    super(401, message, 'Unauthorized');
  }
};
