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

/**
 * Native `<input type="range">` only.
 *
 * Do **not** call `setPointerCapture` on range inputs — Safari/WebKit treats it as part of the
 * native drag gesture and can leave the thumb “stuck” to the pointer until a second click.
 * Session end uses window `pointerup` / `pointercancel` only (no capture).
 */
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

    if (pointerActiveRef.current) {
      pointerSessionCleanupRef.current?.();
    }

    if (keyboardSessionRef.current) {
      keyboardSessionRef.current = false;
      onAdjustmentSessionEnd?.();
    }

    const el = event.currentTarget;
    const pointerId = event.pointerId;

    pointerActiveRef.current = true;
    onAdjustmentSessionStart?.();

    const finishPointerSession = () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      pointerSessionCleanupRef.current = null;

      if (!pointerActiveRef.current) return;
      pointerActiveRef.current = false;

      if (document.activeElement === el) {
        el.blur();
      }

      onAdjustmentSessionEnd?.();
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      finishPointerSession();
    };

    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    pointerSessionCleanupRef.current = () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      pointerSessionCleanupRef.current = null;
      if (pointerActiveRef.current) {
        pointerActiveRef.current = false;
        onAdjustmentSessionEnd?.();
      }
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
