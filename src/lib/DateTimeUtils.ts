/**
 * Converts a time value to a locale-specific weekday name using the user's
 * system settings for the language (locale).
 * * @param timeValue The time to convert (Date, string, or number).
 * @param format The desired format ('long', 'short', or 'narrow').
 * @returns The locale-specific day name or "Invalid Date".
 */
export function getWeekday(timeValue: Date | string | number, format: "long" | "short" | "narrow" = "short"): string {
	const date = new Date(timeValue);

	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}

	// 1. Automatically get the user's locale (e.g., 'en-US', 'fr-FR').
	const userLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

	// 2. Use the automatic locale for formatting the weekday name.
	return date.toLocaleString(userLocale, {
		weekday: format,
	});
}
