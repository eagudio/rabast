import { HttpRequest } from "./httprequest";
import { HttpResponse } from "./httpresponse";

export interface Resolver {
  handle(request: HttpRequest, root: string): Promise<HttpResponse>;
}

