import type React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-600 text-white py-4 px-5">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex flex-col items-start"> 
          <p className="text-sm">
            © {new Date().getFullYear()} all rights reserved by rrishiddh.
          </p>
          <p className="text-xs mt-1 opacity-80">
            Library Management System. Built with Next.js, RTK, TS.
          </p>
        </div>

        <Link
          href="https://github.com/Apollo-Level2-Web-Dev/B5A4" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 transition-colors border rounded-full border-white p-1"
          aria-label="GitHub Profile"
        >
          <Github className="h-5 w-5 " />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;