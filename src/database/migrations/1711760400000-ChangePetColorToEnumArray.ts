import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePetColorToEnumArray1711760400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pets
      ALTER COLUMN color TYPE pet_color_enum[]
      USING (
        CASE
          WHEN color IS NULL THEN NULL
          ELSE ARRAY[color]
        END
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE pets
      ALTER COLUMN color TYPE pet_color_enum
      USING (
        CASE
          WHEN color IS NULL OR array_length(color, 1) IS NULL THEN NULL
          ELSE color[1]
        END
      )
    `);
  }
}
