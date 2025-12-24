import { cn } from "@/lib/ClassUtils";

/**
 * Props for the GlassyCard component.
 */
interface GlassCardProps {
	children?: React.ReactNode; // Content to render inside the card
	className?: string;
}

/**
 * A reusable glassmorphism-style card component.
 * Features a soft gradient background, backdrop blur, rounded corners, and subtle shadow.
 * Intended for use as a container for UI elements like forms, weather info, etc.
 */
const GlassyCard: React.FC<GlassCardProps> = ({ children, className }) => {
	return (
		<div
			className={cn(
				// Glassmorphism effect: light orange gradient with low opacity
				"bg-linear-to-t from-[#F0AA8D]/20 to-[#F0AA8D]/5",
				// Fixed size and padding
				"w-[650px] h-[540px] py-6 px-10",
				// Visual styling: rounded corners, slight blur, and shadow
				"rounded-2xl backdrop-blur-xs shadow-lg",
				// Layout: column flex with centered items and spacing
				"flex flex-col items-center space-y-2.5",
				// Allow user to extend/override classes
				className
			)}
		>
			{children}
		</div>
	);
};

export default GlassyCard;
