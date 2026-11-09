import type { ReactNode, PointerEvent } from "react";
/** Original CSS foil: no WebGL loop, no effect on game state. */
export function HoloFinish({
  children,
  enabled = false,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  function track(e: PointerEvent<HTMLDivElement>) {
    if (
      !enabled ||
      e.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--foil-x", `${x * 100}%`);
    e.currentTarget.style.setProperty("--foil-y", `${y * 100}%`);
    e.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 10}deg`);
    e.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 10}deg`);
  }
  function leave(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <div
      className={`holo-finish ${enabled ? "holo-enabled" : ""}`}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      {children}
      {enabled && <span className="holo-foil" aria-hidden="true" />}
    </div>
  );
}
