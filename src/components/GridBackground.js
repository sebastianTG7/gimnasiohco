import { cn } from "../lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <>
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#444444_1px,transparent_1px),linear-gradient(to_bottom,#444444_1px,transparent_1px)]"
        )} />
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </>
  );
}
