import axios from "axios";

export interface Film {
  id: number;
  title: string;
  photo: string;
  release_date: string;
}

export interface Schedule {
  id: number;
  film: Film;
}

export interface TicketTransaction {
  id: number;
  appuser_id: number;
  schedule: Schedule;
  seats: string[];
  gross_amount: number;
  status: string;
  expires_at: string;
  qr_code_path: string;
  created_at: string;
  updated_at: string;
}

const API_TICKETS_URL = "http://127.0.0.1:8000/api/admin/ticket-transactions";

export const getTicketTransactions = async (): Promise<TicketTransaction[]> => {
  try {
    const response = await axios.get<{ data: TicketTransaction[] }>(API_TICKETS_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};
