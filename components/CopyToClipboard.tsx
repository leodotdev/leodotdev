"use client";

import React, { ReactNode } from "react";

interface CopyToClipboardProps {
  textToCopy: string;
  children: ReactNode;
  className?: string;
}

const CopyToClipboard = ({
  textToCopy,
  children,
  className,
}: CopyToClipboardProps) => {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("My email—leo@leo.dev—has been copied to your clipboard.");
      })
      .catch((err) => {
        console.error("Failed to copy text.", err);
      });
  };

  return (
    <div className={className} onClick={copyToClipboard}>
      {children}
    </div>
  );
};

export default CopyToClipboard;
