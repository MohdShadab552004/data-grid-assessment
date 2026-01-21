import { useState, useCallback, useRef } from 'react';

export function useScrollSync() {
    const [scrollState, setScrollState] = useState({ scrollTop: 0, scrollLeft: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        setScrollState({
            scrollTop: target.scrollTop,
            scrollLeft: target.scrollLeft,
        });
    }, []);

    return {
        scrollState,
        onScroll,
        containerRef,
    };
}
