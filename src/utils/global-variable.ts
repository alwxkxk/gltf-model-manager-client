import Space from "@/utils/Space";

declare type globalVariableType = {
  space: Space | null;
};
const globalVariable: globalVariableType = {
  space: null,
};

export function setSpace(space: Space | null) {
  if (globalVariable.space) {
    globalVariable.space.dispose();
  }
  globalVariable.space = space;
}

export function getSpace() {
  return globalVariable.space;
}
