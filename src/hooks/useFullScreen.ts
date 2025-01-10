import { useCallback, useEffect, useState } from 'react';

export default function useFullScreen() {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState<boolean>();

  const toggleFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullScreenEnabled(true);
    } else if (document.exitFullscreen) {
      setIsFullScreenEnabled(false);
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const fullscreenChangeHandler = (e: Event) => {
      console.log(e);
      if (!document.fullscreenElement) {
        setIsFullScreenEnabled(false);
      }
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  return { isFullScreenEnabled, toggleFullScreen };
}
