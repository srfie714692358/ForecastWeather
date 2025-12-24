import GlassyCard from "@/components/GlassyCard";
import Background from "@/features/background/Background";
import CitySearchWidget from "@/features/city-search/CitySearch";
import WeatherDetail from "@/features/weather-detail/WeatherDetail";
import WeatherForecast from "@/features/weather-forecast/WeatherForecast";
import { useFetchWeather } from "@/hooks/useFetchWeather";

import type { ReactElement } from "react";
import { LoaderCircle } from "lucide-react";
import { Earth } from "@/assets/icons";

/**
 * Placeholder component shown when no city has been searched yet.
 * Displays a friendly prompt with an icon to encourage user input.
 */
function Placeholder(): ReactElement {
	return (
		<>
			<Earth />
			<p className="font-katibeh text-2xl text-[#FFCEAC]">Type a city name to view the weather.</p>
		</>
	);
}

/**
 * Main application component.
 * Orchestrates layout, state handling, and conditional rendering of:
 * - Loading state
 * - Error messages
 * - Placeholder prompt
 * - Weather details and forecast (when data is available)
 */
function App() {
	// Fetch weather data using a custom hook that manages loading, error, and data states
	const { loading, error, weather } = useFetchWeather();

	return (
		<div className="min-h-screen relative flex justify-center items-center">
			{/* Background component renders animated slideshow from assets/bg-images/ Provides visual depth and aesthetic appeal to the application */}
			<Background />
			<GlassyCard>
				<h2 className="text-[#813100] text-5xl font-kaushan text-center mb-8">City Weather</h2>
				<CitySearchWidget />
				<div className="flex-1 w-full h-full flex flex-col justify-center items-center gap-3">
					{/* Show placeholder only when no search has been performed yet */}
					{!loading && !error && !weather && <Placeholder />}

					{/* Show spinner while fetching weather data */}
					{loading && <LoaderCircle className="text-[#FFCEAC] animate-spin" strokeWidth={2} size={50} />}

					{/* Display error message if the weather API request fails */}
					{error && <span className="text-[16px] text-[#FFCEAC] font-karma font-bold">{error}</span>}

					{/* Render weather details and forecast once data is successfully loaded */}
					{!loading && !error && weather && (
						<>
							<WeatherDetail />
							<WeatherForecast />
						</>
					)}
				</div>
			</GlassyCard>
		</div>
	);
}

export default App;
