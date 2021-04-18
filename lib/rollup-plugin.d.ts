export default function (): {
    name: string;
    resolveId(id: string): string | null;
    load(id: string): string | null;
};
