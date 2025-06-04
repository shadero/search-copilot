export function ResultTd(props: React.ComponentProps<'td'>) {
	return <td{...props} />;
}

function ResultTable({ headers: headerNames, rows }: { headers: string[], rows: React.ReactNode[] }) {
	const headers = headerNames.map((header, index) => (
		<th key={index}>{header}</th>
	));

	const rowElements = rows.map((row, index) => (
		<tr key={index}>
			{row}
		</tr>
	));
	return (
		<div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
			<table className="table">
				<thead>
					<tr>
						{headers}
					</tr>
				</thead>
				<tbody>
					{rowElements}
				</tbody>
			</table>
		</div>
	);
}

export default ResultTable;