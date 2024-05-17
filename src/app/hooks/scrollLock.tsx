import React from 'react';

export const useScrollLock = () => {
  const lockScroll = React.useCallback(() => {
    const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarCompensation}px`;
    document.body.dataset.scrollLock = 'true';
  }, []);

  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    delete document.body.dataset.scrollLock;
  }, []);

  React.useLayoutEffect(() => {
    const scrollBarCompensation = window.innerWidth - document.body.offsetWidth;
    document.body.style.setProperty('--scrollbar-compensation', `${scrollBarCompensation}px`);
  }, []);

  return {
    lockScroll,
    unlockScroll
  };
};
