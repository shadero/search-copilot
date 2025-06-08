export default function Template({ body }: { body: React.ReactNode }) {
	return (
		<div className="drawer lg:drawer-open">
			<input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content flex flex-col">
				<div className="navbar bg-base-300 w-full">
					<div className="flex-none lg:hidden">
						<label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								className="inline-block h-6 w-6 stroke-current"
							>
								<path
									strokeLinecap="round"
									strokeWidth="2"
									d="M4 6h16M4 12h16M4 18h16"
								></path>
							</svg>
						</label>
					</div>
					<div className="mx-2 flex-1 px-2">SEO</div>
				</div>
				<div className="p-4">
					{body}
				</div>
			</div>
			<div className="drawer-side z-40 lg:drawer-open">
				<label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="menu bg-base-200 min-h-full w-80 p-4">
					<li><a href="/search">Search</a></li>
					<li><a href="/suggestKeywords">Keyword Suggest</a></li>
				</ul>
			</div>
		</div>
	);
}
