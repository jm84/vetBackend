import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Species } from '../../species/entities/species.entity';

@Entity({ name: 'breeds' })
export class Breed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'specie_id', type: 'uuid' })
  specieId: string;

  @ManyToOne(() => Species, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'specie_id' })
  species: Species;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate: Date;
}
