import { Plans } from "../types/Plan";

export const getPlanName = (planId: number, plans: Plans[]) => {
  const found = plans.find((p) => p.id === planId);
  return found ? found.name : "Unknown Plan";
};
