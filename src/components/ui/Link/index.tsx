import * as React from "react";
import { cn } from "@/lib";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLElement> {}

const Link: React.FC<LinkProps> = (props) => {
  const { children, className, target, href } = props;

  return (
    <a
      target={target}
      href={href}
      className={cn(
        "text-sky-400 cursor-pointer transition-colors hover:underline hover:text-sky-500",
        className
      )}
    >
      {children}
    </a>
  );
};

export default Link;
