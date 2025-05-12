export interface Product {
  id: number;
  name: string;
  harga: number;
  stock: number;
  average_rating?: number;
  terjual: number;
  pemesananMin: number;
  picture: string;
  deskripsi: string;
  category_id: number;
  bv: number;
  beratPengiriman: number;
  beratBersih: number;
  created_at: string;
  updated_at: string;
}
