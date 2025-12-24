import { fetchCities } from "@/apis/CitySearch";
import type { FetchOptions } from "@/apis/CitySearch";
import type { City } from "@/types/City";
import { useEffect, useState, useRef } from "react";

/**
 * Fetches city suggestions based on a search query
 * Automatically aborts previous requests when the query changes (using AbortController).
 * Returns loading state, error (if any), and matched cities.
 */
export const useFetchCities = (query: string, options: FetchOptions = {}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cities, setCities] = useState<City[]>([]);
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		// Reset state and abort any ongoing request
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setCities([]);
		setLoading(false);
		setError(null);
		controllerRef.current?.abort();

		// Skip fetch if query is empty or too short
		if (!query?.trim()) return;

		const controller = new AbortController();
		controllerRef.current = controller;
		setLoading(true);

		fetchCities(query, options, controller.signal)
			.then((res) => {
				if (controller.signal.aborted) return;

				if (res.status >= 200 && res.status < 300) {
					setCities(res.data);
				} else {
					setError(res.error || "Failed to fetch cities");
				}
			})
			.catch((err) => setError(err.message || "Failed to fetch cities"))
			.finally(() => setLoading(false));

		// Abort on unmount or before next effect run
		return () => controller.abort();
	}, [query, options]);

	return { loading, error, cities };
};
