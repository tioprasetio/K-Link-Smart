export interface Bonus {
  id: number;
  user_id: number;
  bv_period_id: number;
  total_downline_bv: number;
  bonus_ringgit: number;
  bonus_rupiah: number;
  status: "paid" | "unpaid"; // pastikan status-nya enum string
  proof_transfer: string | null; // link ke Laravel storage, bisa null
  created_at: string; // ISO date string
  updated_at: string;
  period_name: string;
}
