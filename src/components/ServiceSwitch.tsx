export const Services = ["Note", "Google"] as const;
export type Service = (typeof Services)[number];

type ServiceSwitchProps = {
	displayServices: readonly Service[];
	service: Service;
	setService: (service: Service) => void;
};

export default function ServiceSwitch({ displayServices, service, setService, }: ServiceSwitchProps) {
	return (
		<div className="join">{
			displayServices.map((svc) => (
				<input
					key={svc}
					type="radio"
					aria-label={svc}
					className="join-item btn"
					checked={service === svc}
					onChange={() => setService(svc)}
				/>
			))
		}
		</div>
	);
}