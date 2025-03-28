import { Method } from "./method";

export const Post = (route: string = '') => new Method(route);
export const Get = (route: string = '') => new Method(route);
export const Put = (route: string = '') => new Method(route);
export const Delete = (route: string = '') => new Method(route);
export const Patch = (route: string = '') => new Method(route);
export const Head = (route: string = '') => new Method(route);
export const Options = (route: string = '') => new Method(route);
export const Connect = (route: string = '') => new Method(route);
export const Trace = (route: string = '') => new Method(route);
