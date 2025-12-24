import { cn } from "@/lib/ClassUtils";
import { getWeekday } from "@/lib/DateTimeUtils";
import { getSimpleWeatherStatus } from "@/lib/WeatherUtils";
import { AppStates } from "@/stores/globalStates";
import type { DayWeather, Weather } from "@/types/WeatherDetail";
import { useState, type ReactElement } from "react";

/**
 * Displays a single forecast entry (hourly or daily).
 */
interface ForecastProps {
	index: string; // Unique key (ISO time string)
	label: string; // Formatted time or weekday
	status: string; // Simplified weather condition (e.g., "Sunny")
	temp: number; // Temperature in °C
}

function Forecast({ index, label, status, temp }: ForecastProps): ReactElement {
	return (
		<div key={index} className="w-full text-center font-bold">
			{label} <br />
			<span className="font-semibold">
				{status} &nbsp; {temp}°C
			</span>
		</div>
	);
}

/**
 * Toggle button to switch between hourly and daily forecast views.
 */
function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }): ReactElement {
	return (
		<span
			className={cn("px-3 pt-1.5 mr-2 rounded-2xl cursor-pointer duration-500 bg-[#FFE5D3]/25", active && "bg-[#813100]")}
			onClick={onClick}
		>
			{label}
		</span>
	);
}

/**
 * Weather forecast section with toggle between next 4 hours and next 4 days.
 * Pulls data from global state and formats it using utility functions.
 */
function WeatherForecast(): ReactElement | null {
	const [forecastType, setForecastType] = useState<"hours" | "days">("hours");
	const weather = AppStates((s) => s.theCityWeather);

	if (!weather) return null;

	const nextHours = weather.nextHours.slice(0, 4);
	const nextDays = weather.nextDays.slice(0, 4);

	return (
		<div className="w-full font-karma font-bold text-[#FFCEAC]">
			{/* Forecast type toggle */}
			<div className="px-2 text-[12px]">
				<ToggleButton label="Hours" active={forecastType === "hours"} onClick={() => setForecastType("hours")} />
				<ToggleButton label="Days" active={forecastType === "days"} onClick={() => setForecastType("days")} />
			</div>

			{/* Forecast list */}
			<div className="mt-3 flex text-[16px]">
				{forecastType === "days"
					? nextDays.map((detail: DayWeather) => (
							<Forecast
								key={detail.time}
								index={detail.time}
								label={getWeekday(detail.time)}
								status={getSimpleWeatherStatus(detail.weathercode, true)}
								temp={Math.floor((detail.temp_max + detail.temp_min) / 2)}
							/>
					  ))
					: nextHours.map((detail: Weather) => (
							<Forecast
								key={detail.time}
								index={detail.time}
								label={detail.time.split("T")[1]} // Extract time part (e.g., "14:00")
								status={getSimpleWeatherStatus(detail.weathercode, true)}
								temp={detail.temperature}
							/>
					  ))}
			</div>
		</div>
	);
}

export default WeatherForecast;
