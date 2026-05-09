import type { HTMLAttributes } from "react";
import { cx } from "@/lib/helpers";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card", className)} {...props} />;
}
