import { IsDate } from 'class-validator';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export const TIMESTAMP_TYPE = 'timestamp without time zone';

export abstract class BaseColumn {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: TIMESTAMP_TYPE, default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  public created_at: Date;

  @Column({ type: TIMESTAMP_TYPE, default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  @IsDate()
  public updated_at: Date;
}
