export interface Profile {
  id: number;
  name: string;
  whatsapp: string;
  last_period_start: string | null;
  cycle_length: number;
  next_predicted_period: string | null;
  reminders_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Period {
  id: number;
  profile_id: number;
  start_date: string;
  notes: string;
  created_at: string;
}

export interface CycleInfo {
  next_period_date: string;
  days_remaining: number;
  days_elapsed: number;
  cycle_length: number;
  current_phase: "menstrual" | "follicular" | "ovulation" | "luteal";
  reminder_date: string;
}
