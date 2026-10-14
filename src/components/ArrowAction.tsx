import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const variants = {
  solid: "btn-fill bg-ink text-white",
  light: "btn-fill btn-fill-light bg-white text-ink",
  text: "h-auto min-h-11 justify-start rounded-none px-0 text-inherit hover:opacity-60",
} as const;

type Variant = keyof typeof variants;

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function ArrowAction({
  children,
  variant = "solid",
  className,
  href,
  target,
  rel,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const classes = cn(
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-medium transition-colors duration-300",
    variants[variant],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      <ArrowUpRight
        className="arrow-icon size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
        aria-hidden
      />
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} target={target} rel={rel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
