import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreatePwdTable1711159200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pwd',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'hash_pass',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'client_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '30',
            isNullable: false,
            default: `'recepcionista'`,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'creation_date',
            type: 'timestamp',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'expiration_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'timeToexpire',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'is_security',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'pwd',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedTableName: 'clients',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('pwd');
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('client_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('pwd', foreignKey);
    }

    await queryRunner.dropTable('pwd', true);
  }
}
