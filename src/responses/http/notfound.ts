import { HttpError } from "./httperror";

export class NotFound extends HttpError {
  constructor(message: string) {
    super(404, message, 'Not Found');
  }
};
