export interface MigrationMethod {
  id: number;
  title: string;
  image_url: string | null;
  is_active: boolean;
  factor: number;
  usage1: string | null;
  usage2: string | null;
  usage3: string | null;
  advantage1: string | null;
  advantage2: string | null;
  advantage3: string | null;
  description: string | null;
}

export interface MigrationRequest {
  id: number;
  status: 'DRAFT' | 'DELETED' | 'FORMED' | 'COMPLETED' | 'REJECTED';
  creation_datetime: string;
  formation_datetime: string | null;
  completion_datetime: string | null;
  client: number;
  manager: number | null;
  amount_data: number | null;
  result_migration_time: string | null;
}

export interface MigrationMethodInRequest {
  id: number;
  migration_request: number;
  migration_method: MigrationMethod;
  bandwidth: number | null;
}

export interface UserMigrationRequest {
  draft_request_id: number;
  migration_methods_count: number;
}

export interface SearchParams {
  text?: string;
}