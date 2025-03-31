import { Method } from "./method";

export const Post = () => new Method('POST');
export const Get = () => new Method('GET');
export const Put = () => new Method('PUT');
export const Delete = () => new Method('DELETE');
export const Patch = () => new Method('PATCH');
export const Head = () => new Method('HEAD');
export const Options = () => new Method('OPTIONS');
export const Connect = () => new Method('CONNECT');
export const Trace = () => new Method('TRACE');
