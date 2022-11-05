import type { ConfigurationServer, Server } from "./types/hardware";
import type { ServerImpact } from "./types/impact";
import { env } from "$env/dynamic/public";

const base = env.PUBLIC_API_URL + ":" + env.PUBLIC_API_PORT + "/v1";

async function send(method: string, path: string, data: unknown = undefined) {
  const opts: RequestInit = { method, headers: {} };
  opts.method = method;
  opts.headers = {
    "Content-Type": "application/json",
  };
  if (method != "GET") {
    opts.body = JSON.stringify(data);
  }
  const res = await fetch(`${base}/${path}`, opts);
  if (!res.ok) throw new Error((await res.json())["detail"]);
  return res;
}

export async function get(path: string) {
  return send("GET", path);
}

export async function post(path: string, data) {
  return send("POST", path, data);
}

export async function getServerImpact(server: Server): Promise<ServerImpact> {
  console.log(server);
  const params = "?verbose=false&allocation=TOTAL";
  const res = await post("server/" + params, {
    configuration: server.config,
    usage: server.usage,
  });
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}
