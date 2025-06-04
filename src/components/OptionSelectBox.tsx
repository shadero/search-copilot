import type { Dictionary } from "../utils/Dictionary";

export default function OptionSelectBox({ name, map, onChange, defaultValue }: { name: string, map: Dictionary<string, string>, onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void, defaultValue?: string }) {
	return (
		<>
			<legend className="fieldset-legend">{name}</legend>
			<select className="select select-sm" onChange={onChange} defaultValue={defaultValue}>
				{Object.entries(map).map(([key, value]) => (
					<option key={key} value={key}>
						{value}
					</option>
				))}
			</select>
		</>
	);
}