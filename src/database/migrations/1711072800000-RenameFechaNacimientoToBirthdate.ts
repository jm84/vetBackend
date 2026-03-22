import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameFechaNacimientoToBirthdate1711072800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('clients', 'fechanacimiento', 'birthdate');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('clients', 'birthdate', 'fechanacimiento');
  }
}
