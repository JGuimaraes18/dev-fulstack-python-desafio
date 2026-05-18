import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar direto aqui */}
      <Sidebar />

      <div className="flex flex-col flex-1 h-full">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}