import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorContactsToRelationOnly1711933200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE contacts DROP COLUMN IF EXISTS name`,
    );
    await queryRunner.query(
      `ALTER TABLE contacts DROP COLUMN IF EXISTS address`,
    );
    await queryRunner.query(
      `ALTER TABLE contacts DROP COLUMN IF EXISTS phone`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS UQ_contacts_client_pet ON contacts (client_id, pet_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS UQ_contacts_client_pet`);

    await queryRunner.query(
      `ALTER TABLE contacts ADD COLUMN name character varying(150) NOT NULL DEFAULT 'Sin nombre'`,
    );
    await queryRunner.query(
      `ALTER TABLE contacts ADD COLUMN address character varying(200) NOT NULL DEFAULT 'Sin direccion'`,
    );
    await queryRunner.query(
      `ALTER TABLE contacts ADD COLUMN phone character varying(30) NOT NULL DEFAULT '000000000'`,
    );
  }
}
