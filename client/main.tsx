import "./global.css";
import { createRoot, Root } from "react-dom/client";
import App from "./App";

// Prevent multiple createRoot calls during HMR
let root: Root | null = null;

function initializeApp() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  // Check if root already exists (for HMR)
  if (!root) {
    root = createRoot(container);
  }
  
  root.render(<App />);
}

// Initialize the app
initializeApp();

// Handle HMR (Hot Module Replacement)
if (import.meta.hot) {
  import.meta.hot.accept("./App", () => {
    // Re-render the app when App component is updated
    if (root) {
      root.render(<App />);
    }
  });
}
