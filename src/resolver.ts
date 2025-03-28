import { HttpRequest } from "./responses/httprequest";
import { HttpResponse } from "./responses/httpresponse";

export interface Resolver {
  handle(request: HttpRequest, root: string): Promise<HttpResponse | null>;
}

