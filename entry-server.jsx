import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "node:stream";
import App from "./App";
export function render(route, pathname) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let timeout;
    const output = new Writable({
      write(chunk, _encoding, done) {
        chunks.push(Buffer.from(chunk));
        done();
      },
    });
    output.on("finish", () => {
      clearTimeout(timeout);
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    output.on("error", reject);
    const stream = renderToPipeableStream(
      <App initialRoute={route} initialPathname={pathname} />,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onError(error) {
          reject(error);
        },
      },
    );
    timeout = setTimeout(() => {
      stream.abort();
      reject(new Error("Prerender timeout: " + pathname));
    }, 30000).unref();
  });
}
