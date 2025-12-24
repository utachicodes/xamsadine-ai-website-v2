import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeometricBackground from "./GeometricBackground";
import PageTransition from "./PageTransition";

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app-shell bg-gradient-to-b from-sand-50 via-islamic-light to-sand-100 text-islamic-dark">
      <div className="app-shell-gradient" />
      <GeometricBackground />

      <Navbar />

      <main className="app-shell-main">
        <PageTransition key={location.pathname}>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
};

export default AppShell;


