import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// A hard refresh while inside a multiplayer room (/:roomName/:pseudo)
// shouldn't silently rejoin that room -- the socket that was actually in it
// just died with the old page, and the server already handles that
// disconnect (awarding the opponent the win). Land on the menu instead.
// This runs exactly once, before React Router ever sees the URL, since
// checking "was this page load a reload" from inside a component can't
// distinguish that from a later, ordinary in-app navigation to a room --
// the browser's navigation-timing entry doesn't change for those.
const [navEntry] = performance.getEntriesByType(
  "navigation",
) as PerformanceNavigationTiming[];
if (navEntry?.type === "reload") {
  const segments = window.location.pathname.split("/").filter(Boolean);
  const isRoomRoute = segments.length === 2 && segments[0] !== "solo";
  if (isRoomRoute) {
    window.history.replaceState(null, "", "/home");
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
