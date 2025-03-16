import "jsr:@sigma/deno-compile-extra@0.10.0/localStoragePolyfill";
import "jsr:@sigma/deno-compile-extra@0.10.0/fetchPatch";
import { SizeHint, Webview } from "jsr:@webview/webview@0.9.0";

const worker = new Worker(import.meta.resolve("./server.ts"), {
  type: "module",
});
const webview = new Webview(true);
webview.title = "Clipboard History";
webview.size = { width: 1200, height: 800, hint: SizeHint.NONE };

const localStorageKey = "clipboardHistory";
webview.bind("add", (value) => {
  const storage = localStorage.getItem(localStorageKey);
  const history = storage ? JSON.parse(storage) : [];
  history.push(value);
  localStorage.setItem(localStorageKey, JSON.stringify(history));
  return {};
});

webview.bind("clear", () => {
  localStorage.removeItem(localStorageKey);
  return {};
});

webview.bind("getAll", () => {
  const storage = localStorage.getItem(localStorageKey);
  const history = storage ? JSON.parse(storage) : [];
  return { items: history };
});

worker.onmessage = (e) => {
  switch (e.data.type) {
    case "port": {
      const { port } = e.data;
      webview.navigate(`http://localhost:${port}`);
      webview.run();
      worker.terminate();
      Deno.exit(0);
      break;
    }
    default:
      console.warn(`Unknown message type: ${e.data.type}`);
      break;
  }
};
