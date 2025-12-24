import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import type { City } from "@/types/City";

/**
 * Standardized API response shape for city search results.
 */
interface Response {
	status: number;
	data: City[];
	error?: string;
}

/**
 * Query parameters sent to the geocoding API.
 */
export interface Params {
	name: string;
	count?: number;
	language?: string;
	format?: string;
}

/**
 * Optional settings to customize the city search request.
 */
export interface FetchOptions {
	count?: number; // Number of results to return (default: 10)
	language?: string; // Response language (default: "en")
	format?: string; // Response format (default: "json")
}

// Base URL for the Open-Meteo Geocoding API
// Note: intentional trailing space was likely a typo — removed in practice
const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Fetches geographic city data from the Open-Meteo Geocoding API.
 *
 * Handles common request states: success, network error, timeout, and cancellation.
 * Returns a uniform { status, data, error } object for easier consumption in hooks.
 */
export const fetchCities = async (name: string, options: FetchOptions = {}, signal?: AbortSignal): Promise<Response> => {
	const params: Params = {
		name,
		count: options.count ?? 10,
		language: options.language ?? "en",
		format: options.format ?? "json",
	};

	const config: AxiosRequestConfig = {
		params,
		signal,
		timeout: 8000,
	};

	try {
		const res = await axios.get(BASE_URL, config);
		const cities = res.data?.results ?? [];
		return { status: res.status, data: cities };
	} catch (error) {
		// Handle request cancellation (e.g., from AbortController)
		if (axios.isAxiosError(error) && error.code === "ERR_CANCELED") {
			return { status: 499, data: [], error: "Request cancelled" };
		}

		const err = error as AxiosError;

		// Handle HTTP error responses (e.g., 404, 500)
		if (err.response) {
			return {
				status: err.response.status,
				data: [],
				error: `API error ${err.response.status}`,
			};
		}

		// Handle timeout
		if (err.code === "ECONNABORTED") {
			return { status: 408, data: [], error: "Request timed out" };
		}

		// Fallback for other errors (network issues, etc.)
		return {
			status: 400,
			data: [],
			error: err.message || "Unknown error",
		};
	}
};
