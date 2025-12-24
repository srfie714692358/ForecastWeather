import { SearchIcon, X } from "lucide-react";
import { Command } from "@/components/ui/command";
import { CommandInput } from "cmdk";
import { cn } from "@/lib/ClassUtils";

/**
 * Search input box with integrated clear button and search icon.
 * Used in the city search widget to capture user queries.
 */
export function InputBox({
	query,
	onValueChange,
	openResultBox,
	cleanQuery,
}: {
	query: string;
	onValueChange: (v: string) => void; // Updates the search query
	openResultBox: () => void; // Opens the city suggestions dropdown
	cleanQuery: () => void; // Clears the input field
}) {
	return (
		<Command className="py-3 px-4 flex flex-row gap-2 items-center rounded-sm bg-[#FFE5D3]/25 font-karma font-bold text-xl">
			<SearchIcon className="text-[#813100]" size={20} strokeWidth={3} />

			<CommandInput
				value={query}
				onValueChange={onValueChange}
				onClick={openResultBox}
				placeholder="Search for a city"
				className="w-full outline-none border-none shadow-none bg-transparent translate-y-1 placeholder:text-[#FFCEAC]/40 text-[#813100]"
			/>

			{/* Clear button: visible only when input is not empty */}
			<X
				className={cn("text-[#813100] transition-opacity duration-500", query ? "" : "opacity-0")}
				size={20}
				strokeWidth={3}
				onClick={cleanQuery}
			/>
		</Command>
	);
}
