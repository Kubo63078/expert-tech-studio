import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="skip-link"
      onFocus={(e) => e.target.scrollIntoView()}
    >
      {children}
    </a>
  );
};

export default SkipLink;