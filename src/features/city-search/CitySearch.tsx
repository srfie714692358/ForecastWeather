import { useEffect, useMemo, useState, type ReactElement } from "react";

import { InputBox } from "@/features/city-search/components/Input";
import { ListBox, Empty, Loading, Error, CityItem, LoadMore } from "./components/CitiesListComponents";

import { useFetchCities } from "./hooks/useFetchCities";
import { useDebounce } from "@/hooks/useDebounce";
import { AppStates } from "@/stores/globalStates";

import type { City } from "@/types/City";

/**
 * Main city search widget that combines input, debounced API fetching,
 * infinite scroll, and global state synchronization.
 * 
 * - Displays a searchable input field.
 * - Fetches city suggestions based on user input (min. 3 characters).
 * - Supports infinite scroll via "Load More" button.
 * - Persists selected city in global Zustand store.
 */
function CitySearchWidget(): ReactElement {
	const { targetCity, setTargetCity } = AppStates((s) => s);
	const [query, setQuery] = useState<string>("");
	const [showCitiesList, setShowCitiesList] = useState<boolean>(false);
	const [resultCitiesCount, setResultCitiesCount] = useState<number>(5); // Initial fetch limit

	// Debounce user input to avoid excessive API calls
	const debouncedQuery = useDebounce(query, 800);

	// Memoize fetch options to prevent unnecessary re-fetching
	const fetchOptions = useMemo(() => ({ count: resultCitiesCount }), [resultCitiesCount]);

	// Fetch cities based on debounced query and current count
	const { loading, error, cities } = useFetchCities(debouncedQuery, fetchOptions);

	/**
	 * Handles city selection:
	 * - Updates input with selected city name
	 * - Stores selected city in global state
	 * - Closes the suggestions dropdown
	 */
	const handleSelect = (city: City): void => {
		setQuery(city.name);
		setTargetCity(city);
		setShowCitiesList(false);
	};

	/**
	 * Reset result count to initial value when query is too short or empty,
	 * ensuring clean state for next valid search.
	 */
	useEffect(() => {
		if (query.trim().length < 3) {
			setResultCitiesCount(5);
		}
	}, [query]);

	return (
		<div className="w-full flex flex-col gap-2">
			<InputBox
				query={query}
				onValueChange={setQuery}
				openResultBox={() => setShowCitiesList(true)}
				cleanQuery={() => setQuery("")}
			/>

			<ListBox open={showCitiesList} setOpen={setShowCitiesList}>
				{cities.map((city) => (
					<CityItem
						key={city.id}
						city={city}
						isSelected={city.id === targetCity?.id}
						handleSelect={() => handleSelect(city)}
					/>
				))}

				{loading && <Loading />}
				{!loading && error && <Error error={error} />}
				{cities.length > 0 && <LoadMore onClick={() => setResultCitiesCount((prev) => prev + 5)} />}
				{!loading && !error && !cities.length && <Empty />}
			</ListBox>
		</div>
	);
}

export default CitySearchWidget;