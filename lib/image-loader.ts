export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/")) return src;
  return `${src}?w=${width}`;
}
