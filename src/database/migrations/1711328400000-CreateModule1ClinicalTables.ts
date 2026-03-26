import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateModule1ClinicalTables1711328400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'client_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'species',
            type: 'varchar',
            length: '40',
            isNullable: false,
          },
          {
            name: 'breed',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'sex',
            type: 'varchar',
            length: '1',
            isNullable: false,
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'weight_current',
            type: 'numeric',
            precision: 6,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            length: '60',
            isNullable: true,
          },
          {
            name: 'microchip',
            type: 'varchar',
            length: '60',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'sterilized',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'pets',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'clients',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'pets',
      new TableIndex({ name: 'IDX_PETS_CLIENT_ID', columnNames: ['client_id'] }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'clinical_encounters',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'pet_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'veterinarian_user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'reason_for_visit',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'anamnesis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'physical_exam',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'diagnosis',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'treatment_plan',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'prescriptions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'encounter_date',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'follow_up_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '10',
            isNullable: false,
            default: `'open'`,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'clinical_encounters',
      new TableForeignKey({
        columnNames: ['pet_id'],
        referencedTableName: 'pets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'clinical_encounters',
      new TableIndex({
        name: 'IDX_CLINICAL_ENCOUNTERS_PET_DATE',
        columnNames: ['pet_id', 'encounter_date'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'vaccine_records',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'pet_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'vaccine_name',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'application_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'next_due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'lot_number',
            type: 'varchar',
            length: '80',
            isNullable: true,
          },
          {
            name: 'veterinarian_user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'vaccine_records',
      new TableForeignKey({
        columnNames: ['pet_id'],
        referencedTableName: 'pets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'vaccine_records',
      new TableIndex({
        name: 'IDX_VACCINE_RECORDS_PET_ID',
        columnNames: ['pet_id'],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'allergy_records',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'pet_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'allergen',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'reaction',
            type: 'varchar',
            length: '180',
            isNullable: false,
          },
          {
            name: 'severity',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'allergy_records',
      new TableForeignKey({
        columnNames: ['pet_id'],
        referencedTableName: 'pets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'allergy_records',
      new TableIndex({
        name: 'IDX_ALLERGY_RECORDS_PET_ID',
        columnNames: ['pet_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('allergy_records', 'IDX_ALLERGY_RECORDS_PET_ID');
    await queryRunner.dropTable('allergy_records', true);

    await queryRunner.dropIndex('vaccine_records', 'IDX_VACCINE_RECORDS_PET_ID');
    await queryRunner.dropTable('vaccine_records', true);

    await queryRunner.dropIndex(
      'clinical_encounters',
      'IDX_CLINICAL_ENCOUNTERS_PET_DATE',
    );
    await queryRunner.dropTable('clinical_encounters', true);

    await queryRunner.dropIndex('pets', 'IDX_PETS_CLIENT_ID');
    await queryRunner.dropTable('pets', true);
  }
}
