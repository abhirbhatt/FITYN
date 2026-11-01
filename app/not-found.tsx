import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <header className="flex items-center justify-between border-b border-line pb-4">
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-display text-black min-h-touch min-w-touch flex items-center"
        >
          FITYN
        </Link>
        <span className="font-accent text-lg text-olive">404</span>
      </header>

      <section className="my-auto py-16 flex flex-col items-center text-center">
        <span className="font-accent text-xl text-olive mb-2">Piece Not Found</span>
        <h1 className="font-display text-h1 uppercase text-black tracking-display mb-4">
          404 ARCHIVE
        </h1>
        <p className="font-sans text-sm md:text-base text-black/70 max-w-md mb-8">
          The requested garment, collection or page does not exist in the current drop.
        </p>
        <Link
          href="/"
          className="min-h-touch min-w-touch inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity"
        >
          RETURN TO RAIL &rarr;
        </Link>
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Status: 404 Not Found</span>
      </footer>
    </main>
  );
}

