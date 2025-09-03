import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1756466820363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'firstName', type: 'varchar', length: '50' },
          { name: 'lastName', type: 'varchar', length: '50' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'username', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          {
            name: 'avatar',
            type: 'varchar',
            length: '255',
            default: `'default_avatar.png'`,
          },
          {
            name: 'cover',
            type: 'varchar',
            length: '255',
            default: `'default_cover.png'`,
          },
          { name: 'fullName', type: 'varchar', length: '255' },
          {
            name: 'role',
            type: 'enum',
            enum: ['CLIENT', 'ADMIN'],
            default: `'CLIENT'`,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
            default: `'ACTIVE'`,
          },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
