import { Application, Router, send, Status } from "jsr:@oak/oak@17.1.4";

if (import.meta.main) {
  // @ts-ignore checking for worker
  if (self?.postMessage) {
    injectWorkerCode();
  }

  const app = new Application();
  const router = new Router();

  // Load history from localStorage on startup
  let clipboardHistory: string[] = [];
  const storedHistory = localStorage.getItem("clipboardHistory");
  if (storedHistory) {
    try {
      clipboardHistory = JSON.parse(storedHistory);
    } catch (error) {
      console.error("Error parsing stored history:", error);
      clipboardHistory = []; // Reset if parsing fails
    }
  }

  // API endpoint to add a new item to the history
  router.post("/add", async (ctx) => {
    try {
      const value = await ctx.request.body.json();

      if (value && typeof value.text === "string") {
        clipboardHistory.push(value.text);
        // Save to localStorage
        localStorage.setItem(
          "clipboardHistory",
          JSON.stringify(clipboardHistory),
        );
        ctx.response.status = 201; // Created
        ctx.response.body = { message: "Item added to history" };
      } else {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "Invalid request body. 'text' property (string) is required.",
        };
      }
    } catch (error) {
      console.error("Error adding item:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  router.post("/clear", (ctx) => {
    try {
      // Clear the array
      clipboardHistory = [];
      // Update localStorage
      localStorage.setItem(
        "clipboardHistory",
        JSON.stringify(clipboardHistory),
      );

      ctx.response.status = 200;
      ctx.response.body = { message: "History cleared successfully" };
    } catch (error) {
      console.error("Error clearing history:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  });

  // API endpoint to get a history item by index
  router.get("/get", (ctx) => {
    const indexParam = ctx.request.url.searchParams.get("index");
    const wantJson = ctx.request.url.searchParams.has("json");
    const index = Number.parseInt(indexParam ?? "0", 10);

    if (Number.isNaN(index) || index < 0 || index >= clipboardHistory.length) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Item not found" };
      return;
    }

    const item = clipboardHistory[clipboardHistory.length - 1 - index];

    if (wantJson) {
      ctx.response.body = { item };
    } else {
      ctx.response.body = item;
    }
  });

  router.get("/getAll", (ctx) => {
    const wantJson = ctx.request.url.searchParams.has("json");
    const reversedHistory = [...clipboardHistory].reverse();
    if (wantJson) {
      ctx.response.body = { items: reversedHistory };
    } else {
      ctx.response.body = reversedHistory.join("\n\n--\n\n");
    }
  });

  router.get("/", async (ctx) => {
    await send(ctx, "index.html", {
      root: ".",
    });
  });

  app.use(router.routes());
  app.use(async (ctx, next) => {
    try {
      await send(ctx, ctx.request.url.pathname, {
        root: ".",
      });
    } catch {
      // File not found, continue to next middleware
      await next();
    }
  });

  app.use((ctx) => {
    ctx.response.status = Status.NotFound;
    ctx.response.body = {
      error: "Not Found",
      message: "The requested resource could not be found",
      path: ctx.request.url.pathname,
    };
  });

  const port = 8485;
  // @ts-ignore type is correct
  await app.listen({
    port,
    onListen: () => {
      // @ts-ignore checking for worker
      if (self?.postMessage) {
        // @ts-ignore for worker
        self.postMessage({ type: "port", port });
      } else {
        console.log(`Server listening on http://localhost:${port}`);
      }
    },
  });
}

function injectWorkerCode() {
  // localstorage will be handlede by webview binding
  // @ts-ignore for worker
  globalThis.localStorage = {
    getItem: (_key: string): string | null => {
      return null;
    },
    setItem: (_key: string, _value: string): void => {
    },
  };
}
