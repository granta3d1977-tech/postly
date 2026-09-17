import * as React from "react";

export const Badge = ({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`} {...props} />
);
