export default function (): {
  name: string
  resolveId(resourcePath: string): string | null
  load(resourcePath: string): string | null
}
