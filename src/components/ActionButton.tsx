import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  children, 
  onClick, 
  className = "",
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-[rgba(222,196,255,1)] 
        border 
        w-[196px] 
        max-w-full 
        overflow-hidden 
        text-xl 
        text-[rgba(18,0,44,1)] 
        font-medium 
        leading-loose 
        px-[19px] 
        py-[9px] 
        rounded-lg 
        border-[rgba(207,169,255,1)] 
        border-solid
        transition-all
        duration-200
        hover:bg-[rgba(207,169,255,1)]
        hover:border-[rgba(190,150,255,1)]
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-[rgba(207,169,255,1)]
        focus:ring-offset-2
        ${className}
      `}
      type="button"
      role="button"
      aria-label={typeof children === 'string' ? children : 'Action button'}
    >
      {children}
    </button>
  );
};
