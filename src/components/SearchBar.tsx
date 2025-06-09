type SearchBarProps = {
	initialQuery: string;
	onSearch?: (query: string) => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ initialQuery, onSearch, onChange }: SearchBarProps) {
	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const input = event.currentTarget.querySelector('input[type="search"]') as HTMLInputElement;
		onSearch?.(input.value);
	}

	return (
		<form onSubmit={onSubmit} className="mb-8">
			<label className="input input-xl">
				<svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<g
						strokeLinejoin="round"
						strokeLinecap="round"
						strokeWidth="2.5"
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
					onChange={onChange}
				/>
			</label>
		</form>
	);
}

export default SearchBar;