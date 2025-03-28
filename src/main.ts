import { Rabast } from "./rabast";
import { Route as RouteClass } from "./route";

export const rabast = () => new Rabast()
export const Route = (path: string, ...methods: any[]) => new RouteClass(path, ...methods)
