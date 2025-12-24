import type { City } from "@/types/City";
import type { WeatherResponse } from "@/types/WeatherDetail";
import { create } from "zustand";

/**
 * Global application state interface managed by Zustand.
 *
 * Holds shared state related to:
 * - Currently selected city
 * - Weather data fetching status (loading, error, result)
 *
 * All state updates are done via explicit setter functions to ensure predictability
 * and compatibility with potential devtools or middleware.
 */
interface AppStatesT {
	// Currently selected city (null if none selected)
	targetCity: City | null;

	// Loading state for weather data fetch
	fetchWeatherLoading: boolean;

	// Error message if weather fetch fails (null if no error)
	fetchWeatherError: string | null;

	// Fetched weather data (null if not yet loaded or cleared)
	theCityWeather: WeatherResponse | null;

	// State setters (explicit for clarity and devtools support)
	setTargetCity: (v: City | null) => void;
	setFetchWeatherLoading: (v: boolean) => void;
	setFetchWeatherError: (v: string | null) => void;
	setTheCityWeather: (v: WeatherResponse | null) => void;
}

/**
 * Zustand store for global app state.
 *
 * This store is used across components to:
 * - Share the selected city
 * - Coordinate weather data fetching/loading states
 * - Persist weather results without prop drilling
 */
export const AppStates = create<AppStatesT>((set) => ({
	targetCity: null,
	fetchWeatherLoading: false,
	fetchWeatherError: null,
	theCityWeather: null,

	setTargetCity: (v) => set({ targetCity: v }),
	setFetchWeatherLoading: (v) => set({ fetchWeatherLoading: v }),
	setFetchWeatherError: (v) => set({ fetchWeatherError: v }),
	setTheCityWeather: (v) => set({ theCityWeather: v }),
}));
