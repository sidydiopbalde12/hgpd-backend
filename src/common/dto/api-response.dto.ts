import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: 'Opération réussie' })
  message: string;

  constructor(success: boolean, data: T, message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}

// Pour les réponses paginées
export class PaginatedResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({ example: 'Liste récupérée avec succès' })
  message: string;

  constructor(items: T[], total: number, page: number, limit: number, message: string) {
    this.success = true;
    this.data = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    this.message = message;
  }
}