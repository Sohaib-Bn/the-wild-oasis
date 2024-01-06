import { useEffect, useRef } from "react";

export function useOutsideClick(action, listenCapturing = true) {
  const ref = useRef();
  useEffect(() => {
    const handleClick = function (e) {
      if (ref.current && !ref.current.contains(e.target)) {
        console.log("click out side");
        action();
      }
    };
    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [action, ref, listenCapturing]);

  return ref;
}
