import type { ReactNode } from 'react';

type RootLayoutProps = {
  children: ReactNode;
};

// `src/app/[locale]/layout.tsx` owns `<html>` and `<body>`.
// This file exists so root routes such as sitemap and robots have a layout.
export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}
