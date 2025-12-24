import { Fade } from "react-slideshow-image";
import type { FadeProps } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

// Load all autumn background images from the specified directory at build time.
// Uses Vite's `import.meta.glob` with query `?url` to get public URLs as strings.
const modules = import.meta.glob("@/assets/bg-images/autumn_bg_*.{png,jpg,jpeg}", {
	eager: true, // Load all matching modules immediately (not lazy-loaded)
	query: "?url", // Import as resolved public URLs (not React components)
	import: "default",
});

// Extract just the image URLs from the imported modules object.
const autumnBackgrounds = Object.values(modules);

// Default fade animation settings for a seamless, unobtrusive background slideshow
const defaultFadeProperties: Partial<FadeProps> = {
	duration: 5000,        // Display each image for 5 seconds
	transitionDuration: 1000, // 1-second fade between images
	indicators: false,     // Hide navigation indicators
	arrows: false,         // Hide navigation arrows
	autoplay: true,        // Auto-advance slides
	pauseOnHover: false,   // Do not pause on hover (keeps background ambient)
};

/**
 * Full-screen background slideshow component using autumn-themed images.
 * Positioned behind all content (`-z-10`) and accepts optional Fade props for customization.
 */
const Background: React.FC<Partial<FadeProps>> = (props) => {
	return (
		<div className="absolute inset-0 -z-10">
			<Fade {...defaultFadeProperties} {...props}>
				{autumnBackgrounds.map((imageUrl, index) => (
					// Each slide must be wrapped in a div with class "each-fade" (required by react-slideshow-image)
					<div key={index} className="each-fade">
						<div
							style={{ backgroundImage: `url(${imageUrl})` }}
							className="h-screen w-full bg-cover bg-center"
						></div>
					</div>
				))}
			</Fade>
		</div>
	);
};

export default Background;
