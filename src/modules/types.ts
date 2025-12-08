export interface MigrationMethod {
  id?: number;
  title: string;
  image_url?: string | null;
  factor?: number;
  usage1?: string | null;
  usage2?: string | null;
  usage3?: string | null;
  advantage1?: string | null;
  advantage2?: string | null;
  advantage3?: string | null;
  description?: string | null;
}

export interface MigrationMethodDetail {
  id?: number;
  title: string;
  image_url?: string | null;
  factor?: number;
  usage1?: string | null;
  usage2?: string | null;
  usage3?: string | null;
  advantage1?: string | null;
  advantage2?: string | null;
  advantage3?: string | null;
  description?: string | null;
}

export interface MigrationRequest {
  id?: number;
  status?: 'DRAFT' | 'DELETED' | 'FORMED' | 'COMPLETED' | 'REJECTED';
  creation_datetime?: string;
  formation_datetime?: string | null;
  completion_datetime?: string | null;
  client?: number;
  manager?: number | null;
  amount_data?: string | null;
  result_migration_time?: string | null;
}

export interface MigrationRequestCreate {
  amount_data?: string | null;
}

export interface MigrationRequestAction {
  action: 'complete' | 'reject';
}

export interface MigrationMethodInRequest {
  id?: number;
  migration_request?: number;
  migration_method?: number;
  bandwidth?: string | null;
  migration_method_title?: string;
  migration_method_factor?: number;
}

export interface MigrationMethodInRequestCreate {
  bandwidth: number;
}

export interface UserMigrationRequest {
  draft_request_id: number | null;
  migration_methods_count: number;
}

export interface User {
  id?: number;
  username?: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  date_joined?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  password: string;
  password_confirm: string;
}

export interface SearchParams {
  text?: string;
}