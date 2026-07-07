import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/** Returns a ref to attach to the main region; focuses it on each navigation. */
export function useRouteFocus<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const location = useLocation();

    useEffect(() => {
        ref.current?.focus();
    }, [location.pathname]);

    return ref;
}
