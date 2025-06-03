type SearchBarProps = {
	initialQuery: string;
	setQuery: (query: string) => void;
	onSubmit?: (event: React.FormEvent) => void;
};

function SearchBar({initialQuery, setQuery, onSubmit }: SearchBarProps) {
	return (
		<form onSubmit={onSubmit}>
			<input
				type="search"
				placeholder="Search..."
				value={initialQuery}
				onChange={e => setQuery(e.target.value)}
			/>
			<button type="submit">Search</button>
		</form>
	);
}

export default SearchBar;