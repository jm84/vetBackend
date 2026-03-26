import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Breed } from '../../breeds/entities/breed.entity';

export enum PetColor {
  BLANCO = 'blanco',
  NEGRO = 'negro',
  MARRON = 'marron',
  GRIS = 'gris',
  DORADO = 'dorado',
  CREMA = 'crema',
  NARANJA = 'naranja',
  ATIGRADO = 'atigrado',
  TRICOLOR = 'tricolor',
  MANCHADO = 'manchado',
  OTRO = 'otro',
}

@Entity({ name: 'pets' })
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id', type: 'uuid' })
  clientId: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ name: 'breed_id', type: 'uuid' })
  breedId: string;

  @ManyToOne(() => Breed, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'breed_id' })
  breed: Breed;

  @Column({ type: 'varchar', length: 1 })
  sex: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ name: 'weight_current', type: 'numeric', precision: 6, scale: 2, nullable: true })
  weightCurrent: number | null;

  @Column({
    type: 'enum',
    enum: PetColor,
    enumName: 'pet_color_enum',
    array: true,
    nullable: true,
  })
  color: PetColor[] | null;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: true })
  microchip: string | null;

  @Column({ type: 'boolean', default: false })
  sterilized: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
