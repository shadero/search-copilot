import type { Dictionary } from "../utils/Dictionary";

export default function OptionSelectBox({ map, onChange, defaultValue }: { map: Dictionary<string, string>, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void, defaultValue?: string }) {
	return (
		<select onChange={onChange} defaultValue={defaultValue}>
			{Object.entries(map).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	);
}