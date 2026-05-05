import * as React from "react";

const VALUE_ADJUST_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
]);

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  /** Fires once when the user begins a drag or keyboard adjustment. */
  onAdjustmentSessionStart?: () => void;
  /** Fires when the drag/release or keyboard adjustment completes. */
  onAdjustmentSessionEnd?: () => void;
};

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  onAdjustmentSessionStart,
  onAdjustmentSessionEnd,
}: Props) {
  const percentage = ((value - min) / (max - min)) * 100;
  const keyboardSessionRef = React.useRef(false);
  const pointerActiveRef = React.useRef(false);
  const pointerSessionCleanupRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    return () => {
      pointerSessionCleanupRef.current?.();
      pointerSessionCleanupRef.current = null;
      if (pointerActiveRef.current || keyboardSessionRef.current) {
        pointerActiveRef.current = false;
        keyboardSessionRef.current = false;
        onAdjustmentSessionEnd?.();
      }
    };
  }, [onAdjustmentSessionEnd]);

  function beginPointerSession(event: React.PointerEvent<HTMLInputElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (keyboardSessionRef.current) {
      keyboardSessionRef.current = false;
      onAdjustmentSessionEnd?.();
    }

    pointerActiveRef.current = true;
    onAdjustmentSessionStart?.();

    const pointerId = event.pointerId;
    const el = event.currentTarget;
    try {
      el.setPointerCapture(pointerId);
    } catch {
      /* older engines */
    }

    const handleUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      try {
        if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      } catch {
        /* ignore */
      }
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      pointerSessionCleanupRef.current = null;
      pointerActiveRef.current = false;
      onAdjustmentSessionEnd?.();
    };

    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    pointerSessionCleanupRef.current = () => {
      try {
        if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
      } catch {
        /* ignore */
      }
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!VALUE_ADJUST_KEYS.has(event.key)) return;
    if (event.repeat) return;
    if (pointerActiveRef.current) return;
    keyboardSessionRef.current = true;
    onAdjustmentSessionStart?.();
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!VALUE_ADJUST_KEYS.has(event.key)) return;
    if (!keyboardSessionRef.current) return;
    keyboardSessionRef.current = false;
    onAdjustmentSessionEnd?.();
  }

  function handleBlur() {
    if (!keyboardSessionRef.current) return;
    keyboardSessionRef.current = false;
    onAdjustmentSessionEnd?.();
  }

  return (
    <input
      type="range"
      className={["slider", className].filter(Boolean).join(" ")}
      style={{ "--slider-pct": `${percentage}%` } as React.CSSProperties}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onPointerDown={beginPointerSession}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    />
  );
}
