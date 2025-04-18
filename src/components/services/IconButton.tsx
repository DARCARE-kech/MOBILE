
import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  badge?: number;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  variant = 'primary', 
  size = 'md', 
  badge,
  className,
  disabled,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  const variantClasses = {
    primary: 'bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90',
    secondary: 'bg-transparent border border-darcare-gold/50 text-darcare-gold hover:bg-darcare-gold/10',
    ghost: 'bg-transparent text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold',
  };
  
  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center transition-colors relative',
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-70 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {badge > 9 ? '9+' : badge}
        </div>
      )}
    </button>
  );
};

export default IconButton;
