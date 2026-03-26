import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity({ name: 'vaccine_records' })
export class VaccineRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ name: 'vaccine_name', type: 'varchar', length: 120 })
  vaccineName: string;

  @Column({ name: 'application_date', type: 'date' })
  applicationDate: Date;

  @Column({ name: 'next_due_date', type: 'date', nullable: true })
  nextDueDate: Date | null;

  @Column({ name: 'lot_number', type: 'varchar', length: 80, nullable: true })
  lotNumber: string | null;

  @Column({ name: 'veterinarian_user_id', type: 'uuid', nullable: true })
  veterinarianUserId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
