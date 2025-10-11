import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  isOrdered?: boolean;
}
