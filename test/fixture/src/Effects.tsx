import React from "react";
import { useEffect, useLayoutEffect } from "react";

export function Effects() {
  useEffect(() => undefined, []);
  useLayoutEffect(() => undefined, []);
  React.useEffect(() => undefined, []);
  return null;
}
