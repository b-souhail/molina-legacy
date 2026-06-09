"use client";

import type { ReactNode } from "react";

type FactureDocumentShellProps = {
  children: ReactNode;
  toolbar?: ReactNode;
};

export function FactureDocumentShell({
  children,
  toolbar,
}: FactureDocumentShellProps) {
  return (
    <div className="facture-page min-h-screen bg-(--cream) py-8 md:py-12 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        {toolbar && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
            {toolbar}
          </div>
        )}
        <div className="shadow-sm ring-1 ring-(--forest)/5 print:shadow-none print:ring-0">
          {children}
        </div>
      </div>
    </div>
  );
}
