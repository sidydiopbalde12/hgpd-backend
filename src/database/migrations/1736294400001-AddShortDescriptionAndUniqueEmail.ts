import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddShortDescriptionAndUniqueEmail1736294400001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('providers');
    if (!table) return;

    // Add short_description column if it does not exist
    if (!table.findColumnByName('short_description')) {
      await queryRunner.addColumn(
        'providers',
        new TableColumn({
          name: 'short_description',
          type: 'text',
          isNullable: true,
        }),
      );
    }

    // Create unique index on email if not present
    const hasEmailIndex = table.indices.some(
      (i) =>
        i.isUnique &&
        i.columnNames.length === 1 &&
        i.columnNames[0] === 'email',
    );

    if (!hasEmailIndex) {
      await queryRunner.createIndex(
        'providers',
        new TableIndex({
          name: 'IDX_providers_email_unique',
          columnNames: ['email'],
          isUnique: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('providers');
    if (!table) return;

    // Drop unique index on email if present
    const emailIndex = table.indices.find(
      (i) =>
        i.name === 'IDX_providers_email_unique' ||
        (i.isUnique &&
          i.columnNames.length === 1 &&
          i.columnNames[0] === 'email'),
    );

    if (emailIndex) {
      await queryRunner.dropIndex('providers', emailIndex);
    }

    // Drop short_description column if present
    if (table.findColumnByName('short_description')) {
      await queryRunner.dropColumn('providers', 'short_description');
    }
  }
}
