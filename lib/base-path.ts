export const BASE_PATH = "";
export function withBase(p: string) {
  if (!p || !p.startsWith("/") || p.startsWith(BASE_PATH + "/")) return p;
  return BASE_PATH + p;
}
