import { gzipSync } from "node:zlib";
// Local production-like validation server: generated pages, redirects and genuine 404s.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { pathRoute, routePath } from "../routing.js";
const root = path.resolve("dist"),
  port = Number(process.env.PORT || 4173),
  config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost:" + port);
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    if (pathname === "/api/verify-payment") {
      let raw = "";
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 16384) {
          res.writeHead(413);
          res.end();
          return;
        }
      }
      try {
        req.body = JSON.parse(raw || "{}");
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (value) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(value));
        return res;
      };
      const { default: handler } = await import("../api/verify-payment.js");
      await handler(req, res);
      return;
    }
    const redirect = config.redirects.find(
      (r) =>
        (r.source === pathname || r.source === "/:path*") &&
        (!r.has ||
          r.has.every(
            (condition) =>
              condition.type === "host" &&
              condition.value ===
                (req.headers.host || "").split(":")[0].toLowerCase(),
          )),
    );
    if (redirect) {
      res.writeHead(redirect.permanent ? 308 : 307, {
        Location:
          redirect.destination.replace(":path*", pathname.replace(/^\//, "")) +
          url.search,
      });
      res.end();
      return;
    }
    const id = pathRoute(pathname);
    if (id && pathname !== "/" && pathname !== routePath(id)) {
      res.writeHead(308, { Location: routePath(id) + url.search });
      res.end();
      return;
    }
    const target = path.resolve(
      root,
      "." + pathname + (pathname.endsWith("/") ? "index.html" : ""),
    );
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(400);
      res.end();
      return;
    }
    let file = target,
      status = 200;
    try {
      if (!id && pathname.endsWith("/")) throw new Error("Missing route");
      await fs.access(file);
    } catch {
      file = path.join(root, "404.html");
      status = 404;
    }
    let content = await fs.readFile(file);
    if (
      /\bgzip\b/.test(req.headers["accept-encoding"] || "") &&
      /\.(html|css|js|json|svg|xml|txt)$/.test(file)
    ) {
      content = gzipSync(content);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Vary", "Accept-Encoding");
    }
    res.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Cache-Control": file.includes("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate",
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Preview server error");
    console.error(error.message);
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log("Production-like preview: http://localhost:" + port),
);
