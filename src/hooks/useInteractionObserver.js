import {useEffect, useState} from "react";

function useIntersectionObserver(targetRef, options) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, options);

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, [targetRef, options]);

    return [isVisible];
}

export default useIntersectionObserver;
