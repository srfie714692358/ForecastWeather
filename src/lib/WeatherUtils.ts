import { Clear, Cloudy, PartlyCloudy, Rainy, Snowy, Sunny, Thunder, Wind, QuestionMark } from "@/assets/icons";

// WMO Weather interpretation codes (WMO-306)
// Source: https://open-meteo.com/en/docs
const WEATHER_CODES: Record<number, string> = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Depositing rime fog",
	51: "Light drizzle",
	53: "Moderate drizzle",
	55: "Dense drizzle",
	56: "Light freezing drizzle",
	57: "Dense freezing drizzle",
	61: "Slight rain",
	63: "Moderate rain",
	65: "Heavy rain",
	66: "Light freezing rain",
	67: "Heavy freezing rain",
	71: "Slight snow fall",
	73: "Moderate snow fall",
	75: "Heavy snow fall",
	77: "Snow grains",
	80: "Slight rain showers",
	81: "Moderate rain showers",
	82: "Violent rain showers",
	85: "Slight snow showers",
	86: "Heavy snow showers",
	95: "Thunderstorm",
	96: "Thunderstorm with slight hail",
	99: "Thunderstorm with heavy hail",
};

/**
 * Converts a WMO weather code into a human-readable description.
 * Falls back to "Unknown status" for invalid or missing codes.
 */
export function getWeatherStatus(code: number | undefined | null): string {
	if (code == null) return "Unknown status";
	return WEATHER_CODES[code] || "Unknown status";
}

// Maps simplified weather categories to corresponding icon components
const STATUS_ICON_MAP = {
	Clear,
	Cloudy,
	PartlyCloudy,
	Rainy,
	Snowy,
	Sunny,
	Thunder,
	Wind,
	QuestionMark,
	"?": QuestionMark, // fallback key for unknown conditions
} as const;

/**
 * Maps a WMO weather code to a simplified category (e.g., "Rainy", "Snowy").
 * Used for consistent theming, icons, or background logic.
 *
 * @param code - WMO weather code
 * @param simpler - If true, returns "?" for unknown instead of "QuestionMark"
 */
export function getSimpleWeatherStatus(code: number, simpler: boolean = false): keyof typeof STATUS_ICON_MAP {
	if (code === 0) return "Sunny";
	if (code === 1) return "Clear";
	if (code === 2 && !simpler) return "PartlyCloudy";
	if ([2, 3, 45, 48].includes(code)) return "Cloudy";
	if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
	if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
	if ([95, 96, 99].includes(code)) return "Thunder";
	return simpler ? "?" : "QuestionMark";
}

/**
 * Returns the React icon component associated with a simplified weather status.
 */
export function getIconComponent(status: keyof typeof STATUS_ICON_MAP) {
	return STATUS_ICON_MAP[status];
}

/**
 * Converts a wind direction in degrees to a cardinal direction string.
 * Uses 8-direction compass (N, NE, E, ..., NW).
 */
export function getWindDirectionText(degrees: number): string {
	const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
	const index = Math.round(degrees / 22.5) % 8;
	return directions[index];
}
