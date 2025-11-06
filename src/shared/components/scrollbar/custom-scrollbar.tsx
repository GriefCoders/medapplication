import type { ReactNode } from "react";
import SimpleBar from "simplebar-react";

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
  autoHide?: boolean;
  forceVisible?: boolean;
}

export const CustomScrollbar = ({
  children,
  className = "",
  autoHide = true,
  forceVisible = false,
}: CustomScrollbarProps) => {
  return (
    <SimpleBar
      className={`h-full ${className}`}
      autoHide={autoHide}
      forceVisible={forceVisible ? "y" : false}
      style={{ height: "100%" }}
    >
      {children}
    </SimpleBar>
  );
};
