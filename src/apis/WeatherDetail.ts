import type { WeatherResponse, Weather, DayWeather } from "@/types/WeatherDetail";
import axios, { AxiosError } from "axios";

// --- Constants ---
const BASE_URL = "https://api.open-meteo.com/v1/forecast";

// --- Mappings (API Key -> Your Type Key) ---
// Maps API response keys to your application's keys for current and hourly data
const COMMON_MAP = {
	weathercode: "weathercode",
	temperature_2m: "temperature",
	apparent_temperature: "feels_like",
	relative_humidity_2m: "humidity",
	wind_speed_10m: "wind_speed",
	wind_direction_10m: "wind_direction",
} as const;

// Maps API response keys to your application's keys for daily data
const DAILY_MAP = {
	weathercode: "weathercode",
	temperature_2m_max: "temp_max",
	temperature_2m_min: "temp_min",
	apparent_temperature_max: "feels_like_max",
	apparent_temperature_min: "feels_like_min",
} as const;

/**
 * Maps an object's keys to new keys based on a provided mapping.
 * @param data - The input object to map.
 * @param map - The mapping of keys from the input object to the output object.
 * @returns A new object with keys mapped according to the provided mapping.
 */
const mapObj = <T extends Record<string, unknown>, M extends Record<string, string>>(
	data: T,
	map: M
): Record<M[keyof M] | keyof T, unknown> => {
	const result = {} as Record<M[keyof M] | keyof T, unknown>;

	for (const apiKey in data) {
		if (apiKey in map) {
			// If the key is in the map, use the mapped key in the result
			result[map[apiKey]] = data[apiKey];
		} else {
			// Otherwise, keep the original key
			result[apiKey] = data[apiKey];
		}
	}

	return result;
};

/**
 * Maps an array of objects based on a provided mapping.
 * @param data - The input object containing arrays to map.
 * @param map - The mapping of keys from the input object to the output object.
 * @returns An array of objects with keys mapped according to the provided mapping.
 */
const mapArray = <T extends Record<string, unknown> & { time: string[] }, M extends Record<string, string>>(
	data: T,
	map: M,
	options?: { sortByTime?: boolean; filterFromCurrentTime?: boolean }
): Array<Record<M[keyof M], unknown> & { time: string }> => {
	if (!Array.isArray(data.time)) {
		return [];
	}

	let result = data.time.map((time: string, index: number) => {
		const mapped = {} as Record<M[keyof M], unknown>;

		for (const apiKey in map) {
			if (apiKey in data && Array.isArray(data[apiKey])) {
				mapped[map[apiKey]] = data[apiKey][index];
			}
		}

		return {
			time,
			...mapped,
		};
	});

	if (options?.filterFromCurrentTime) {
		const now = new Date();
		result = result.filter((item) => new Date(item.time) >= now);
	}

	if (options?.sortByTime) {
		result = result.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
	}

	return result;
};

/**
 * Fetches weather data from the Open-Meteo API.
 * @param lat - Latitude of the location.
 * @param lng - Longitude of the location.
 * @param signal - Optional AbortSignal for request cancellation.
 * @returns A promise that resolves to a WeatherResponse object.
 */
export const fetchWeather = async (lat: number, lng: number, signal?: AbortSignal): Promise<WeatherResponse> => {
	const params = {
		latitude: lat,
		longitude: lng,
		current: Object.keys(COMMON_MAP).join(","),
		hourly: Object.keys(COMMON_MAP).join(","),
		daily: Object.keys(DAILY_MAP).join(","),
		timezone: "auto",
	};

	const config = {
		signal,
		timeout: 8000,
		params,
	};

	try {
		const { data } = await axios.get(BASE_URL, config);

		return {
			status: 200,
			current: mapObj(
				data.current as Record<keyof typeof COMMON_MAP & { [key: string]: unknown }, Weather[keyof typeof COMMON_MAP]>,
				COMMON_MAP
			) as Weather,
			nextHours: mapArray(data.hourly, COMMON_MAP, { sortByTime: true, filterFromCurrentTime: true }) as Weather[],
			nextDays: mapArray(data.daily, DAILY_MAP, { sortByTime: true, filterFromCurrentTime: true }) as DayWeather[],
		};
	} catch (err) {
		const error = err as AxiosError;
		return {
			status: error.response?.status || 400,
			current: {} as Weather,
			nextHours: [],
			nextDays: [],
			error: error.message || "Unknown error",
		};
	}
};
