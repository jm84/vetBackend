import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

export enum ClinicalEncounterStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity({ name: 'clinical_encounters' })
export class ClinicalEncounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pet_id', type: 'uuid' })
  petId: string;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ name: 'veterinarian_user_id', type: 'uuid' })
  veterinarianUserId: string;

  @Column({ name: 'reason_for_visit', type: 'text' })
  reasonForVisit: string;

  @Column({ type: 'text', nullable: true })
  anamnesis: string | null;

  @Column({ name: 'physical_exam', type: 'text', nullable: true })
  physicalExam: string | null;

  @Column({ type: 'text', nullable: true })
  diagnosis: string | null;

  @Column({ name: 'treatment_plan', type: 'text', nullable: true })
  treatmentPlan: string | null;

  @Column({ type: 'text', nullable: true })
  prescriptions: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'encounter_date', type: 'timestamp' })
  encounterDate: Date;

  @Column({ name: 'follow_up_date', type: 'timestamp', nullable: true })
  followUpDate: Date | null;

  @Column({
    type: 'varchar',
    length: 10,
    default: ClinicalEncounterStatus.OPEN,
  })
  status: ClinicalEncounterStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
