import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeClientAvatarNullable1711501200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE clients ALTER COLUMN avatar DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE clients SET avatar = '' WHERE avatar IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE clients ALTER COLUMN avatar SET NOT NULL`,
    );
  }
}
