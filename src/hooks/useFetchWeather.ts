import { fetchWeather } from "@/apis/WeatherDetail";
import { AppStates } from "@/stores/globalStates";
import { useEffect, useRef } from "react";

/**
 * Custom hook to fetch weather data for the currently selected city.
 * Manages loading state, errors, and request cancellation automatically.
 * Data and states are stored in the global Zustand store.
 */
export const useFetchWeather = () => {
	const setWeather = AppStates((s) => s.setTheCityWeather);
	const setError = AppStates((s) => s.setFetchWeatherError);
	const setLoading = AppStates((s) => s.setFetchWeatherLoading);
	const city = AppStates((s) => s.targetCity);

	// Track abort controller to cancel pending requests when component unmounts or city changes
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		// Reset state and abort any ongoing request when city changes
		setWeather(null);
		setLoading(false);
		setError(null);
		if (controllerRef.current) controllerRef.current.abort();

		// Don't fetch if no city is selected
		if (!city) return;

		const controller = new AbortController();
		controllerRef.current = controller;

		setLoading(true);
		setError("");

		fetchWeather(city?.latitude, city?.longitude, controller.signal)
			.then((res) => {
				if (controller.signal.aborted) return;

				if (res.status >= 200 && res.status < 300) {
					setWeather(res);
				} else {
					setError(res.error || "Failed to fetch weather detail");
				}
			})
			.catch((err) => setError(err.message || "Failed to fetch weather detail"))
			.finally(() => setLoading(false));
	}, [city, setError, setLoading, setWeather]);

	// Return current weather state from the global store
	return {
		loading: AppStates((s) => s.fetchWeatherLoading),
		error: AppStates((s) => s.fetchWeatherError),
		weather: AppStates((s) => s.theCityWeather),
	};
};
