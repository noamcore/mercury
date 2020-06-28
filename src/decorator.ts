import { Mercury } from "./mercury";

export const messageHandler = (descriptor: string) => {
  return (constructor: Function) => {
    Mercury.bindings.set(descriptor, constructor.name);
  };
};
