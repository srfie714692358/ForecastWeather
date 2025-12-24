import { useEffect, useRef, useState } from "react";

/**
 * Debounces a value: updates only after `delay` milliseconds of inactivity.
 * Commonly used to delay API calls until user stops typing.
 */
export function useDebounce<T>(value: T, delay = 400): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(handler); // cancel on re-render or unmount
	}, [value, delay]);

	return debounced;
}

/**
 * Debounces a function: delays its execution until `delay` ms after the last call.
 * Always uses the latest version of the function (avoids stale closures).
 */
export function useFuncDebounce<T extends unknown[], R>(func: (...args: T) => R, delay = 400): (...args: T) => void {
	const ref = useRef({
		func,
		timeout: null as ReturnType<typeof setTimeout> | null,
	});

	// Keep the ref in sync with the latest function
	useEffect(() => {
		ref.current.func = func;
	}, [func]);

	return (...args: T) => {
		if (ref.current.timeout) clearTimeout(ref.current.timeout);
		ref.current.timeout = setTimeout(() => {
			ref.current.func(...args);
			ref.current.timeout = null;
		}, delay);
	};
}
