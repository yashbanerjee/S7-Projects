import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-white px-6 pt-28">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink">404</p>
        <h1 className="font-display mt-4 text-5xl tracking-tight md:text-6xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you are looking for may have moved, or the link is incorrect.
        </p>
        <div className="mt-10">
          <Button href="/">Return home</Button>
        </div>
      </div>
    </section>
  );
}
