import { useState } from "react";

export function Widget({ on }: { on: boolean }) {
  if (on) {
    const [count] = useState(0);
    return <span>{count}</span>;
  }
  return null;
}
