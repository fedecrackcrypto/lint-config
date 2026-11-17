import * as React from "react";

export function Namespace() {
  const [count] = React.useState(0);
  return <p>{count}</p>;
}
