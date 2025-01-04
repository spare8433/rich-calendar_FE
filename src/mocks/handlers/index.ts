import { AuthHandlers } from "@/mocks/handlers/auth.handler";
import { ScheduleHandlers } from "@/mocks/handlers/schedule.handler";
import { UserHandlers } from "@/mocks/handlers/user.handler";

export const handlers = [...ScheduleHandlers, ...AuthHandlers, ...UserHandlers];

export default handlers;
