import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactsTable1711846800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE contacts (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        client_id uuid NOT NULL,
        pet_id uuid NOT NULL,
        name character varying(150) NOT NULL,
        address character varying(200) NOT NULL,
        phone character varying(30) NOT NULL,
        creation_date TIMESTAMP NOT NULL DEFAULT now(),
        update_date TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_contacts_id PRIMARY KEY (id),
        CONSTRAINT FK_contacts_client_id FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
        CONSTRAINT FK_contacts_pet_id FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IDX_contacts_client_id ON contacts (client_id)`,
    );
    await queryRunner.query(`CREATE INDEX IDX_contacts_pet_id ON contacts (pet_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IDX_contacts_pet_id`);
    await queryRunner.query(`DROP INDEX IDX_contacts_client_id`);
    await queryRunner.query(`DROP TABLE contacts`);
  }
}
