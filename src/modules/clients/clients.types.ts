import { Client } from './entities/client.entity';

export interface PaginatedClientsResponse {
  data: Client[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
