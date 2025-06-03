function ResultTable({headers: headerNames, rows}: {headers: string[], rows: React.ReactNode[]}) {
	const headers = headerNames.map((header, index) => (
		<th key={index}>{header}</th>
	));
	return (
		<table>
			<thead>
				<tr>
					{headers}
				</tr>
			</thead>
			<tbody>
				{rows}
			</tbody>
		</table>
	);
}

export default ResultTable;