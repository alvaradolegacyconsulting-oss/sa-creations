import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-ink",
  outline: "border border-navy bg-white text-navy hover:bg-sand",
};

export const buttonClasses = (variant: ButtonVariant) =>
  `inline-flex min-h-12 items-center justify-center rounded-full px-6 text-center text-[0.9375rem] font-semibold transition-colors ${variantClasses[variant]}`;

/** A link styled as a button. External links open in a new tab. */
export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  const external = href.startsWith("http");

  return (
    <a href={href} className={`${buttonClasses(variant)} ${className}`} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

/** "Plan your event →" style link, copper on light backgrounds. */
export function ArrowLink({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-copper underline underline-offset-4 hover:text-navy ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}
