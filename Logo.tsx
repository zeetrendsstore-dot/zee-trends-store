import React from 'react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'dark',
  size = 'md' 
}) => {
  const { storeLogo } = useStore();

  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[150px] sm:max-w-[170px]',
    md: 'h-10 sm:h-11 max-w-[190px] sm:max-w-[220px]',
    lg: 'h-12 sm:h-14 max-w-[240px] sm:max-w-[280px]',
  };

  // If the store owner has uploaded their official logo file:
  if (storeLogo) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <img
          src={storeLogo}
          alt="ZEE TRENDS STORE"
          className={`${sizeClasses[size]} w-auto object-contain transition-transform`}
          style={{ imageRendering: 'auto' }}
        />
      </div>
    );
  }

  // Official high-resolution SVG logo (preserving original proportions):
  const logoSrc = variant === 'light' 
    ? '/zee-trends-logo-light.svg' 
    : '/zee-trends-logo.svg';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="ZEE TRENDS STORE"
        className={`${sizeClasses[size]} w-auto object-contain`}
        style={{ aspectRatio: '340/70' }}
      />
    </div>
  );
};
