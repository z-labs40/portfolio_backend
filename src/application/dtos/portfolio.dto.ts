export interface CreatePortfolioDto {
  userId: string;
  title: string;
  description?: string;
  template?: string;
  content?: any;
}

export interface UpdatePortfolioDto {
  title?: string;
  description?: string;
  template?: string;
  content?: any;
}

export interface PortfolioResponseDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  template: string;
  content: any;
  createdAt: Date;
  updatedAt: Date;
}
