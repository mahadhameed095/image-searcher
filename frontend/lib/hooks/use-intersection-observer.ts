import { useEffect, useRef, useState } from 'react';

const useIntersectionObserver = (options : IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const element = targetRef.current;
    if(!element) return;
    const observer = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      options
    );
    observer.observe(element)

    return () => {
        observer.unobserve(element);
    };
  }, [targetRef.current, options]);

  return [targetRef, isVisible] as const;
};

export default useIntersectionObserver;
