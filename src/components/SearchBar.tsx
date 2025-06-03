type SearchBarProps = {
	query: string;
	setQuery: (query: string) => void;
	onSubmit?: (event: React.FormEvent) => void;
};

function SearchBar({ query, setQuery, onSubmit }: SearchBarProps) {
	return (
		<form onSubmit={onSubmit}>
			<input
				type="text"
				placeholder="Search..."
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
			<button type="submit">Search</button>
		</form>
	);
}

export default SearchBar;