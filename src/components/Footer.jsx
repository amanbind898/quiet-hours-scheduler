import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-6 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Quiet Hours Scheduler. Built for focused productivity.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Stay focused, stay productive 🎯
        </p>
      </div>
    </footer>
  );
};

export default Footer;
