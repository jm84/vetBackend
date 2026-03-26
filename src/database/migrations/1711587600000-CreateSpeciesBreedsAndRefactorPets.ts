import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSpeciesBreedsAndRefactorPets1711587600000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE species (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        name character varying(80) NOT NULL,
        creation_date TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_species_id PRIMARY KEY (id),
        CONSTRAINT UQ_species_name UNIQUE (name)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE breeds (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        specie_id uuid NOT NULL,
        name character varying(100) NOT NULL,
        creation_date TIMESTAMP NOT NULL DEFAULT now(),
        update_date TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT PK_breeds_id PRIMARY KEY (id),
        CONSTRAINT UQ_breeds_specie_name UNIQUE (specie_id, name),
        CONSTRAINT FK_breeds_specie_id FOREIGN KEY (specie_id) REFERENCES species(id) ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IDX_breeds_specie_id ON breeds (specie_id)`,
    );

    await queryRunner.query(`ALTER TABLE pets ADD COLUMN breed_id uuid`);

    await queryRunner.query(`
      INSERT INTO species (name)
      SELECT DISTINCT TRIM(p.species)
      FROM pets p
      WHERE p.species IS NOT NULL AND TRIM(p.species) <> ''
      ON CONFLICT (name) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO breeds (specie_id, name)
      SELECT s.id, x.breed_name
      FROM (
        SELECT DISTINCT TRIM(species) AS species_name, TRIM(breed) AS breed_name
        FROM pets
        WHERE species IS NOT NULL
          AND breed IS NOT NULL
          AND TRIM(species) <> ''
          AND TRIM(breed) <> ''
      ) x
      INNER JOIN species s ON s.name = x.species_name
      ON CONFLICT (specie_id, name) DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE pets p
      SET breed_id = b.id
      FROM breeds b
      INNER JOIN species s ON s.id = b.specie_id
      WHERE s.name = TRIM(p.species)
        AND b.name = TRIM(p.breed)
    `);

    await queryRunner.query(`
      INSERT INTO species (name)
      VALUES ('No especificada')
      ON CONFLICT (name) DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO breeds (specie_id, name)
      SELECT s.id, 'No especificada'
      FROM species s
      WHERE s.name = 'No especificada'
      ON CONFLICT (specie_id, name) DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE pets p
      SET breed_id = b.id
      FROM breeds b
      INNER JOIN species s ON s.id = b.specie_id
      WHERE p.breed_id IS NULL
        AND s.name = 'No especificada'
        AND b.name = 'No especificada'
    `);

    await queryRunner.query(`
      ALTER TABLE pets
      ADD CONSTRAINT FK_pets_breed_id FOREIGN KEY (breed_id) REFERENCES breeds(id) ON DELETE RESTRICT
    `);

    await queryRunner.query(`CREATE INDEX IDX_pets_breed_id ON pets (breed_id)`);
    await queryRunner.query(`ALTER TABLE pets ALTER COLUMN breed_id SET NOT NULL`);

    await queryRunner.query(`ALTER TABLE pets DROP COLUMN species`);
    await queryRunner.query(`ALTER TABLE pets DROP COLUMN breed`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pets ADD COLUMN species character varying(40) NOT NULL DEFAULT 'No especificada'`,
    );
    await queryRunner.query(
      `ALTER TABLE pets ADD COLUMN breed character varying(80) NOT NULL DEFAULT 'No especificada'`,
    );

    await queryRunner.query(`
      UPDATE pets p
      SET species = s.name,
          breed = b.name
      FROM breeds b
      INNER JOIN species s ON s.id = b.specie_id
      WHERE p.breed_id = b.id
    `);

    await queryRunner.query(`ALTER TABLE pets DROP CONSTRAINT FK_pets_breed_id`);
    await queryRunner.query(`DROP INDEX IDX_pets_breed_id`);
    await queryRunner.query(`ALTER TABLE pets DROP COLUMN breed_id`);

    await queryRunner.query(`DROP INDEX IDX_breeds_specie_id`);
    await queryRunner.query(`DROP TABLE breeds`);
    await queryRunner.query(`DROP TABLE species`);
  }
}
