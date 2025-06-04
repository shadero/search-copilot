type SearchBarProps = {
	initialQuery: string;
	setQuery: (query: string) => void;
	onSubmit?: (event: React.FormEvent) => void;
};

function SearchBar({ initialQuery, setQuery, onSubmit }: SearchBarProps) {
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
					value={initialQuery}
					onChange={e => setQuery(e.target.value)}
				/>
			</label>
		</form>
	);
}

export default SearchBar;