import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Role } from '../enums/role.enum';

@Entity({ name: 'pwd' })
export class Pwd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hash_pass', type: 'varchar', length: 255 })
  hashPass: string;

  @Column({ name: 'client_id', type: 'uuid', unique: true })
  clientId: string;

  @OneToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'role', type: 'varchar', length: 30, default: Role.RECEPCIONISTA })
  role: Role;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'creation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creationDate: Date;

  @Column({ name: 'expiration_date', type: 'timestamp', nullable: true })
  expirationDate: Date | null;

  @Column({ name: 'timeToexpire', type: 'int', nullable: true })
  timeToExpire: number | null;

  @Column({ name: 'is_security', type: 'boolean', default: false })
  isSecurity: boolean;
}
