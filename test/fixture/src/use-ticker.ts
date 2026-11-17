import { useEffect } from "react";

export function useTicker(onTick: () => void) {
  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => {
      clearInterval(id);
    };
  }, [onTick]);
}
