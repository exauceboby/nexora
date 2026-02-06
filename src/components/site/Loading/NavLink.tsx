"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { useLoading } from "@/components/site/loading/LoadingProvider";

type Props = LinkProps & {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function NavLink({ onClick, ...props }: Props) {
  const { start } = useLoading();

  return (
    <Link
      {...props}
      onClick={(e) => {
        start();
        onClick?.(e);
      }}
    >
      {props.children}
    </Link>
  );
}
