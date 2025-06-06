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
		<div className="btn-group flex gap-2 flex-wrap">{
			displayServices.map((svc) => (
				<input
					key={svc}
					type="radio"
					aria-label={svc}
					className="btn"
					name="service"
					checked={service === svc}
					onChange={() => setService(svc)}
				/>
			))
		}
		</div>
	);
}