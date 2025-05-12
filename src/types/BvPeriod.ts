export interface Period {
  id: string | number;
  name: string;
  start_date: string | Date;
  end_date: string | Date;
  is_cutoff: boolean;
}
