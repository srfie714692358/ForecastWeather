import { CommandEmpty, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/ClassUtils";
import { Check, Loader } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from "react";
import type { City } from "@/types/City";

// Shared base styling for all command items in the city list
const BASE_STYLE = cn(
	"font-karma h-10 border-none transition-colors duration-400",
	"bg-[#FFE5D3]/25 text-[#813100] data-[selected=true]:bg-[#813100]/50 data-[selected=true]:text-[#FFE5D3]/70"
);

/** Loading indicator shown while cities are being fetched. */
export function Loading() {
	return (
		<CommandItem className={BASE_STYLE}>
			<Loader className="text-[#813100] animate-spin duration-700 mx-auto" strokeWidth={3} />
		</CommandItem>
	);
}

/** Displays an API or fetch error message in the city list. */
export function Error({ error }: { error: string | null }) {
	return (
		<CommandItem className={BASE_STYLE}>
			<span className="text-[16px] font-karma font-bold">{error}</span>
		</CommandItem>
	);
}

/** "Load more" button that triggers fetching additional city results. */
export function LoadMore({ onClick }: { onClick: () => void }) {
	return (
		<CommandItem className={cn(BASE_STYLE, "text-center justify-center font-bold text-[16px]")} onClickCapture={onClick}>
			Load more
		</CommandItem>
	);
}

/** Shown when no cities match the current query. */
export function Empty() {
	return (
		<CommandEmpty className="p-2 text-center bg-[#FFE5D3]/25 text-[#813100]">
			<span className="text-[16px] font-karma font-bold">No cities found.</span>
		</CommandEmpty>
	);
}

/** Individual city suggestion item with selection indicator. */
export function CityItem({ city, handleSelect, isSelected }: { city: City; handleSelect: () => void; isSelected: boolean }) {
	return (
		<CommandItem
			key={city.id}
			value={`${city.id}`}
			onSelect={handleSelect}
			className={cn(BASE_STYLE, isSelected && "bg-[#813100]/50 text-[#FFE5D3]/70")}
		>
			<span className="font-bold text-[16px] translate-y-0.5">{city.name}</span>
			<span className="ml-1 font-semibold text-[12px] translate-y-1">
				({city.country_code}-{city.admin1 || city.country})
			</span>
			{isSelected && <Check className="ml-auto mr-1 text-[#FFE5D3]/50" size={20} strokeWidth={3} />}
		</CommandItem>
	);
}

/** Dropdown container for city suggestions, built with Shadcn UI (Radix) Popover + cmdk. */
export function ListBox({ open, setOpen, children }: { open: boolean; setOpen: (s: boolean) => void; children: ReactNode }) {
	return (
		<Popover open={open} onOpenChange={setOpen}>
			{/* Invisible trigger required by Shadcn UI (Radix) Popover; positioned for visual alignment */}
			<PopoverTrigger asChild>
				<span className="-translate-y-2 translate-x-1.5" />
			</PopoverTrigger>

			<PopoverContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				onCloseAutoFocus={(e) => e.preventDefault()}
				className="w-[545px] p-0 bg-transparent border-none shadow-none z-50"
			>
				<ScrollArea className="h-[200px] w-full pr-3">
					<Command className="bg-transparent space-y-1 border-none">{children}</Command>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
