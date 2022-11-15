import { Controller, Get } from "@nestjs/common";
import {
	HealthCheck,
	HealthCheckResult,
	HealthCheckService,
	HealthIndicatorResult,
	HttpHealthIndicator,
	SequelizeHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
	constructor(
		private readonly health: HealthCheckService,
		private readonly http: HttpHealthIndicator,
		private readonly db: SequelizeHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	public async check(): Promise<HealthCheckResult> {
		return this.health.check([
			(): Promise<HealthIndicatorResult> =>
				this.http.pingCheck("google", "https://google.com"),
			(): Promise<HealthIndicatorResult> => this.db.pingCheck("database"),
		]);
	}
}
