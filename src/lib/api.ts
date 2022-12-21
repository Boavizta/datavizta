import type { ConfigurationServer, ConfigurationCloud, Server } from "./types/hardware";
import type { ServerImpact } from "./types/impact";
let base
if (import.meta.env.VITE_PUBLIC_API_URL) {
  base = import.meta.env.VITE_PUBLIC_API_URL
} else {
  base = "https://api.boavizta.org/v1"
}

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
  const params = "?verbose=true&allocation=TOTAL";
  const res = await post("server/" + params, {
    configuration: server.config,
    usage: server.usage,
  });
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}

export async function getCloudImpact(instance: ConfigurationCloud): Promise<ServerImpact> {
  const params = "?verbose=true";
  const res = await post("cloud/" + params, instance);
  return res.text().then((json) => {
    return JSON.parse(json);
  });
}
