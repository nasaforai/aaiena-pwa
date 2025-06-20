import React from 'react';

interface StatusBarProps {
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = "9:30" }) => {
  return (
    <header className="bg-white self-stretch flex min-h-10" role="banner">
      <div className="relative flex min-w-60 h-10 w-full items-stretch justify-between flex-1 shrink basis-[0%] px-4">
        <time className="self-stretch z-0 gap-2 text-sm text-[#12002C] font-normal whitespace-nowrap tracking-[0.25px] leading-none h-full w-32 flex items-center">
          {time}
        </time>
        <img
          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=46&h=24&fit=crop&crop=center"
          alt="Signal and battery indicators"
          className="aspect-[1] object-contain w-[46px] z-0 shrink-0 my-auto"
        />
        <div className="absolute z-0 flex flex-col -translate-x-2/4 translate-y-[0%] w-6 h-6 left-2/4 bottom-2">
          <div 
            className="bg-[rgba(46,46,46,1)] flex w-6 shrink-0 h-6 rounded-[100px]"
            role="presentation"
            aria-label="Camera notch"
          />
        </div>
      </div>
    </header>
  );
};
