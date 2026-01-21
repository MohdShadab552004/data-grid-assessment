import { useMemo } from 'react';

interface UseVirtualizationParams {
    itemCount: number;
    itemSize: number;
    containerSize: number;
    overscan?: number;
    scrollOffset: number;
}

export interface VirtualItem {
    index: number;
    offset: number;
    size: number;
}

export function useVirtualization({
    itemCount,
    itemSize,
    containerSize,
    overscan = 5,
    scrollOffset,
}: UseVirtualizationParams) {
    const range = useMemo(() => {
        // Safety check: if itemSize is 0, virtualization is not possible or meaningful.
        // Return an empty range to prevent division by zero and incorrect calculations.
        if (itemSize <= 0) {
            return {
                items: [],
                startIndex: 0,
                endIndex: -1,
                totalSize: 0,
            };
        }

        const startIndex = Math.max(0, Math.floor(scrollOffset / itemSize) - overscan);
        const endIndex = Math.min(
            itemCount - 1,
            Math.floor((scrollOffset + containerSize) / itemSize) + overscan
        );

        const items: VirtualItem[] = [];
        for (let i = startIndex; i <= endIndex; i++) {
            items.push({
                index: i,
                offset: i * itemSize,
                size: itemSize,
            });
        }

        return {
            items,
            startIndex,
            endIndex,
            totalSize: itemCount * itemSize,
        };
    }, [itemCount, itemSize, containerSize, overscan, scrollOffset]);

    return range;
}
