import profileImage from "@/assets/profile-image.jpg";
import { socialMedia } from "@/assets/social-media-links"; // Contains icon components, URLs, and hover positions
import { cn } from "@/lib/ClassUtils";
import { useState } from "react";

// Base styles for social icons (hidden state: centered on profile image)
const socialMediaBaseStyles = cn(
	"text-[#813100] bg-[#FFCEAC]",
	"p-1 h-8 w-8 rounded-3xl",
	"transition-all duration-400",
	"absolute left-3 top-3 z-10" // z-10 ensures icons sit below profile image (z-30) when hidden
);

function Profile() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="absolute bottom-15 left-15"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Staggered hover animation: icons animate out sequentially using index-based delays */}
			{socialMedia.map((link, index) => (
				<a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
					<link.icon
						className={cn(socialMediaBaseStyles)}
						style={{
							...(isHovered ? link.style : {}),
							transitionDelay: `${index * 100}ms`,
						}}
					/>
				</a>
			))}

			{/* Profile image container must have higher z-index (z-30) to cover hidden icons */}
			<div className="relative w-15 h-15 rounded-4xl overflow-hidden z-30 cursor-pointer">
				<img className="h-30 object-top object-cover" src={profileImage} alt="Profile image" />
			</div>
		</div>
	);
}

export default Profile;
