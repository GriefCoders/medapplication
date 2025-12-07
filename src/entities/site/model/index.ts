export interface Site {
  id: string;
  name: string;
  address: string;
  code: string;
}

export interface CreateSiteDto {
  name: string;
  address: string;
  code: string;
}

export interface UpdateSiteDto {
  name?: string;
  address?: string;
  code?: string;
}

