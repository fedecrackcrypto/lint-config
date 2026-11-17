import React from "react";
import { useEffect, useLayoutEffect } from "react";

export function Effects() {
  useEffect(() => undefined, []);
  useLayoutEffect(() => undefined, []);
  React.useEffect(() => undefined, []);
  return null;
}

export function Justified() {
  // eslint-disable-next-line no-restricted-syntax -- test: a reasoned suppression on the call
  useEffect(() => undefined, []);
  return null;
}
