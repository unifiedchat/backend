import { SetMetadata } from "@nestjs/common";
import { FlagTypes, SHARED } from "@shared";

export const Flags = (...flags: FlagTypes[]): any => {
	const res = SHARED.Permissions.serialize(flags);

	return SetMetadata("flags", res);
};
