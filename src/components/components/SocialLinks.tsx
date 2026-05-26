import socialLinksData from '../../data/socialLinksData';

function SocialLinks() {
	return (
		<div className="flex flex-wrap justify-center gap-2">
			{socialLinksData.map((link) => (
				<a
					key={link.title}
					href={link.href}
					title={link.title}
					target="_blank"
					rel="noopener noreferrer"
					className="bg-surface border border-outline p-2.5 text-content-muted inline-flex items-center justify-center rounded-full transition duration-300 ease-in-out transform hover:bg-primary hover:text-on-accent hover:border-primary hover:scale-110"
				>
					{link.svg}
				</a>
			))}
		</div>
	);
}

export default SocialLinks;
