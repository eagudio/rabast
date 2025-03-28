import { Method } from "./method";

export const Post = (route: string = '') => new Method('POST', route);
export const Get = (route: string = '') => new Method('GET', route);
export const Put = (route: string = '') => new Method('PUT', route);
export const Delete = (route: string = '') => new Method('DELETE', route);
export const Patch = (route: string = '') => new Method('PATCH', route);
export const Head = (route: string = '') => new Method('HEAD', route);
export const Options = (route: string = '') => new Method('OPTIONS', route);
export const Connect = (route: string = '') => new Method('CONNECT', route);
export const Trace = (route: string = '') => new Method('TRACE', route);
