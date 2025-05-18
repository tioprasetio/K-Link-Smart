import { Period } from "../types/BvPeriod";
import { Plans } from "../types/Plan";

export const getPlanName = (planId: number, plans: Plans[]) => {
  const found = plans.find((p) => p.id === planId);
  return found ? found.name : "Unknown Plan";
};

export const getPeriodName = (periodId: number, periods: Period[]) => {
  const found = periods.find((p) => p.id === periodId);
  return found ? found.name : "Unknown Plan";
};