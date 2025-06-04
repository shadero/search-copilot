type SearchBarProps = {
	initialQuery: string;
	onSearch?: (query: string) => void;
};

function SearchBar({ initialQuery, onSearch: onSearch }: SearchBarProps) {
	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const input = event.currentTarget.querySelector('input[type="search"]') as HTMLInputElement;
		onSearch?.(input.value);
	}

	return (
		<form onSubmit={onSubmit}>
			<label className="input">
				<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						stroke-linejoin="round"
						stroke-linecap="round"
						stroke-width="2.5"
						fill="none"
						stroke="currentColor"
					>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="m21 21-4.3-4.3"></path>
					</g>
				</svg>
				<input type="search"
					required
					className="grow"
					placeholder="Search"
					defaultValue={initialQuery}
				/>
			</label>
		</form>
	);
}

export default SearchBar;