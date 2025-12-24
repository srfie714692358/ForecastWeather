import { AppStates } from "@/stores/globalStates";
import { Direction, Humidity, Temperature, Wind } from "@/assets/icons";
import { type ReactElement } from "react";
import { getIconComponent, getSimpleWeatherStatus, getWeatherStatus, getWindDirectionText } from "@/lib/WeatherUtils";

interface WeatherFactProps {
	label: string;
	value: string | number | undefined;
	Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

/**
 * Reusable sub-component to display a labeled weather metric with an icon.
 */
function WeatherFact({ label, value, Icon }: WeatherFactProps): ReactElement {
	return (
		<div className="text-xl text-center min-w-max">
			<span className="mx-auto mb-2.5 block">
				<Icon className="mr-2.5 inline" />
				<span className="inline text-sm font-semibold">{label}</span>
			</span>
			{value}
		</div>
	);
}

/**
 * Displays current weather details for the selected city.
 * Pulls data from global Zustand store and formats key metrics.
 */
function WeatherDetail(): ReactElement | null {
	const weather = AppStates((s) => s.theCityWeather)?.current;

	if (!weather) return null;

	const WeatherStatusIcon = getIconComponent(getSimpleWeatherStatus(weather?.weathercode));

	return (
		<div className="flex flex-row font-karma text-[#FFCEAC]">
			{/* Block One: Current weather summary */}
			<div className="flex flex-col items-center gap-2 px-[34px] py-[30px] font-bold">
				<span className="flex items-center gap-5">
					<WeatherStatusIcon className="text-[#FFCEAC]" width={63} height={61} />
					<span className="text-xl text-shadow">{getWeatherStatus(weather?.weathercode)}</span>
				</span>
				<span className="text-4xl">{weather?.temperature} °C</span>
				<span className="text-lg">{weather?.time.replace("T", "\t")}</span>
			</div>

			{/* Block Two: Additional weather metrics in a grid */}
			<div className="grid grid-cols-2 items-center justify-center gap-x-2.5 gap-y-[5px] py-[15px]">
				<WeatherFact label="Humidity" value={`${weather?.humidity}%`} Icon={Humidity} />
				<WeatherFact label="Wind Speed" value={`${weather?.wind_speed} km/h`} Icon={Wind} />
				<WeatherFact label="Feels like" value={`${weather?.feels_like}°C`} Icon={Temperature} />
				<WeatherFact label="Wind Direction" value={getWindDirectionText(weather?.wind_direction)} Icon={Direction} />
			</div>
		</div>
	);
}

export default WeatherDetail;
