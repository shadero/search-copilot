export function ResultTd(props: React.ComponentProps<'td'>) {
	return <td className="px-6 py-4 font-medium text-gray-900 dark:text-white" {...props} />;
}

function ResultTable({ headers: headerNames, rows }: { headers: string[], rows: React.ReactNode[] }) {
	const headers = headerNames.map((header, index) => (
		<th className="px-6 py-3" key={index}>{header}</th>
	));

	const rowElements = rows.map((row, index) => (
		<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
			{row}
		</tr>
	));
	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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