import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertPetColorToEnum1711674000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_color_enum') THEN
          CREATE TYPE pet_color_enum AS ENUM (
            'blanco',
            'negro',
            'marron',
            'gris',
            'dorado',
            'crema',
            'naranja',
            'atigrado',
            'tricolor',
            'manchado',
            'otro'
          );
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE pets
      ALTER COLUMN color TYPE pet_color_enum
      USING (
        CASE
          WHEN color IS NULL THEN NULL
          WHEN lower(trim(color)) IN ('blanco', 'white') THEN 'blanco'::pet_color_enum
          WHEN lower(trim(color)) IN ('negro', 'black') THEN 'negro'::pet_color_enum
          WHEN lower(trim(color)) IN ('marron', 'cafe', 'brown') THEN 'marron'::pet_color_enum
          WHEN lower(trim(color)) = 'gris' THEN 'gris'::pet_color_enum
          WHEN lower(trim(color)) = 'dorado' THEN 'dorado'::pet_color_enum
          WHEN lower(trim(color)) = 'crema' THEN 'crema'::pet_color_enum
          WHEN lower(trim(color)) = 'naranja' THEN 'naranja'::pet_color_enum
          WHEN lower(trim(color)) = 'atigrado' THEN 'atigrado'::pet_color_enum
          WHEN lower(trim(color)) = 'tricolor' THEN 'tricolor'::pet_color_enum
          WHEN lower(trim(color)) = 'manchado' THEN 'manchado'::pet_color_enum
          ELSE 'otro'::pet_color_enum
        END
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pets
      ALTER COLUMN color TYPE character varying(60)
      USING color::text
    `);

    await queryRunner.query(`DROP TYPE IF EXISTS pet_color_enum`);
  }
}
