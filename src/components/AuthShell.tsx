import { Logo } from "./Logo";

export function AuthShell({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="relative hidden lg:flex items-center justify-center p-10 bg-brand-gradient overflow-hidden">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 h-96 w-96 rounded-full bg-white/15 blur-3xl" />

        <div className="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/10 p-10 backdrop-blur-md shadow-xl">
          <Logo variant="light" size="lg" />
          <h1 className="mt-24 text-5xl font-bold leading-tight text-white whitespace-pre-line">
            {heading}
          </h1>
          <p className="mt-4 text-lg text-white/90 leading-relaxed">
            {subheading}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
