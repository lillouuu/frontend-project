import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-full flex-col items-start justify-center gap-3">
      <h1 className="text-2xl font-semibold text-[#1a2332]">Dashboard</h1>
      <p className="text-sm text-[#6b7280]">
        Build this page next - for now, check out the working audit report:
      </p>
      <Link
        href="/audit"
        className="rounded-lg bg-[#4a7aa8] px-4 py-2 text-sm font-medium text-white"
      >
        View audit report -&gt;
      </Link>
    </div>
  );
}
