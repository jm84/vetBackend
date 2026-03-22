export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  fechanacimiento: string;
  sex: string;
  email: string;
  avatar: string;
}

export interface PaginatedClientsResponse {
  data: Client[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
