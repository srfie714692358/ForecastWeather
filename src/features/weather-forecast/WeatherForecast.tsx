import { cn } from "@/lib/ClassUtils";
import { getWeekday } from "@/lib/DateTimeUtils";
import { getSimpleWeatherStatus } from "@/lib/WeatherUtils";
import { AppStates } from "@/stores/globalStates";
import type { DayWeather, Weather } from "@/types/WeatherDetail";
import { useState, type ReactElement } from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
		<div key={index} className="text-center font-bold ">
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
	const nextPreviousButtonsClasses = cn(
		"bg-[#FFE5D3]/25 hover:bg-[#FFE5D3]/25 hover:text-[#813100]",
		"cursor-pointer border-none select-none",
		"-translate-x-4 [&_svg]:stroke-3 -translate-y-3.5"
	);

	if (!weather) return null;

	return (
		<div className="w-full font-karma font-bold text-[#FFCEAC]">
			{/* Forecast type toggle */}
			<div className="px-2 text-[12px]">
				<ToggleButton label="Hours" active={forecastType === "hours"} onClick={() => setForecastType("hours")} />
				<ToggleButton label="Days" active={forecastType === "days"} onClick={() => setForecastType("days")} />
			</div>

			{/* Forecast list */}
			<Carousel className="w-[90%] mx-auto mt-3 text-[16px]" opts={{ align: "start" }}>
				<CarouselContent className=" ">
					{forecastType === "days"
						? weather.nextDays.map((detail: DayWeather) => (
								<CarouselItem className="basis-1/4 select-none">
									<Forecast
										key={detail.time}
										index={detail.time}
										label={getWeekday(detail.time)}
										status={getSimpleWeatherStatus(detail.weathercode, true)}
										temp={Math.floor((detail.temp_max + detail.temp_min) / 2)}
									/>
								</CarouselItem>
						  ))
						: weather.nextHours.slice(0, 20).map((detail: Weather) => (
								<CarouselItem className="basis-1/4 select-none">
									<Forecast
										key={detail.time}
										index={detail.time}
										label={detail.time.split("T")[1]} // Extract time part (e.g., "14:00")
										status={getSimpleWeatherStatus(detail.weathercode, true)}
										temp={detail.temperature}
									/>
								</CarouselItem>
						  ))}
				</CarouselContent>
				<CarouselPrevious className={cn(nextPreviousButtonsClasses, "translate-x-4")} />
				<CarouselNext className={nextPreviousButtonsClasses} />
			</Carousel>
		</div>
	);
}

export default WeatherForecast;
