import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientRecordNumber1711414800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS clients_record_number_seq START WITH 1000 INCREMENT BY 1`,
    );

    await queryRunner.query(
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS record_number integer`,
    );

    await queryRunner.query(
      `ALTER TABLE clients ALTER COLUMN record_number SET DEFAULT nextval('clients_record_number_seq')`,
    );

    await queryRunner.query(
      `UPDATE clients SET record_number = nextval('clients_record_number_seq') WHERE record_number IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE clients ALTER COLUMN record_number SET NOT NULL`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS UQ_clients_record_number ON clients (record_number)`,
    );

    await queryRunner.query(
      `ALTER SEQUENCE clients_record_number_seq OWNED BY clients.record_number`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS UQ_clients_record_number`);
    await queryRunner.query(`ALTER TABLE clients DROP COLUMN IF EXISTS record_number`);
    await queryRunner.query(`DROP SEQUENCE IF EXISTS clients_record_number_seq`);
  }
}
