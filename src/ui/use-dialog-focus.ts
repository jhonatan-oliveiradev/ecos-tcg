import { useEffect } from "react";
/** Keep keyboard navigation in the topmost modal and restore the invoking control. */
export function useDialogFocus() {
  useEffect(() => {
    let active: HTMLElement | null = null;
    let previous: HTMLElement | null = null;
    const focusable = (el: HTMLElement) =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]',
        ),
      ).filter((e) => e.getClientRects().length > 0);
    const sync = () => {
      const dialogs = document.querySelectorAll<HTMLElement>('[role="dialog"]');
      const top = dialogs.item(dialogs.length - 1);
      if (top === active) return;
      if (active && !top && previous?.isConnected) previous.focus();
      if (top) {
        previous =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        active = top;
        (focusable(top)[0] ?? top).focus();
      } else active = null;
    };
    const keys = (e: KeyboardEvent) => {
      if (!active) return;
      const controls = focusable(active);
      if (e.key === "Escape") {
        const close = active.querySelector<HTMLButtonElement>(
          ".dialog-close, [data-dialog-dismiss]",
        );
        if (close) {
          e.preventDefault();
          close.click();
        }
        return;
      }
      if (e.key !== "Tab") return;
      const first = controls[0],
        last = controls.at(-1);
      if (!first) {
        e.preventDefault();
        return;
      }
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !active.contains(document.activeElement))
      ) {
        e.preventDefault();
        last?.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !active.contains(document.activeElement))
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(document.getElementById("root")!, {
      childList: true,
      subtree: true,
    });
    document.addEventListener("keydown", keys);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("keydown", keys);
    };
  }, []);
}
