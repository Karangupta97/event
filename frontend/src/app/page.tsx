import Link from "next/link";

/**
 * Landing page placeholder.
 *
 * This route (/) is owned by the landing-page work. The Organizer
 * Operations Dashboard lives at /org.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center">
      <div>
        <p className="text-sm font-medium text-blue-600">EventFlow</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          Landing page coming soon
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          This page is reserved for the public landing page. The Organizer
          Operations Dashboard is available at{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
            /org
          </code>
          .
        </p>
      </div>
      <Link
        href="/org"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Open Organizer Console →
      </Link>
    </main>
  );
}
