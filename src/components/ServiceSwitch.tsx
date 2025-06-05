export const Services = ["Note", "Google"] as const;
export type Service = (typeof Services)[number];

export default function ServiceSwitch({
	displayServices,
	service,
	setService,
}: {
	displayServices: readonly Service[];
	service: Service;
	setService: (service: Service) => void;
}) {
	return (
		<div className="btn-group">
			{displayServices.includes("Note") && (
				<input
					type="radio"
					aria-label="Note"
					className="btn"
					name="service"
					checked={service === "Note"}
					onChange={() => setService("Note")}
				/>
			)}
			{displayServices.includes("Google") && (
				<input
					type="radio"
					aria-label="Google"
					className="btn"
					name="service"
					checked={service === "Google"}
					onChange={() => setService("Google")}
				/>
			)}
		</div>
	);
}