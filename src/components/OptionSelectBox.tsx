import type { Dictionary } from "../utils/Dictionary";

type OptionSelectBoxProps = {
	name: string;
	map: Dictionary<string, string>;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
	defaultValue?: string;
};

export default function OptionSelectBox({ name, map, onChange, defaultValue }: OptionSelectBoxProps) {
	return (
		<div className="flex flex-col">
			<legend className="fieldset-legend">{name}</legend>
			<select className="select" onChange={onChange} defaultValue={defaultValue}>
				{Object.entries(map).map(([key, value]) => (
					<option key={key} value={key}>
						{value}
					</option>
				))}
			</select>
		</div>
	);
}