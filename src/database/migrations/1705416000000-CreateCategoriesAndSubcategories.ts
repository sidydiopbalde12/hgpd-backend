import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateCategoriesAndSubcategories1705416000000 implements MigrationInterface {
  name = 'CreateCategoriesAndSubcategories1705416000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si les tables existent déjà
    const categoriesTableExists = await queryRunner.hasTable('categories');
    const subCategoriesTableExists =
      await queryRunner.hasTable('sub_categories');

    // Si les deux tables existent, ne rien faire
    if (categoriesTableExists && subCategoriesTableExists) {
      return;
    }

    // Créer la table categories
    if (!categoriesTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'categories',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
              isUnique: true,
            },
            {
              name: 'slug',
              type: 'varchar',
              length: '100',
              isUnique: true,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'icon',
              type: 'varchar',
              length: '50',
              isNullable: true,
            },
            {
              name: 'display_order',
              type: 'integer',
              default: 0,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
            },
            {
              name: 'created_at',
              type: 'timestamp with time zone',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp with time zone',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );
    }

    // Créer la table sub_categories
    if (!subCategoriesTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'sub_categories',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'category_id',
              type: 'integer',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'slug',
              type: 'varchar',
              length: '100',
            },
            {
              name: 'display_order',
              type: 'integer',
              default: 0,
            },
            {
              name: 'isActive',
              type: 'boolean',
              default: true,
            },
            {
              name: 'isDefault',
              type: 'boolean',
              default: false,
            },
            {
              name: 'created_at',
              type: 'timestamp with time zone',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updated_at',
              type: 'timestamp with time zone',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
        true,
      );

      // Ajouter la contrainte de clé étrangère
      await queryRunner.createForeignKey(
        'sub_categories',
        new TableForeignKey({
          columnNames: ['category_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'categories',
          onDelete: 'CASCADE',
        }),
      );

      // Ajouter les index
      await queryRunner.createIndex(
        'sub_categories',
        new TableIndex({
          columnNames: ['category_id'],
        }),
      );

      await queryRunner.createIndex(
        'sub_categories',
        new TableIndex({
          columnNames: ['category_id', 'slug'],
          isUnique: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la table sub_categories
    const subCategoriesTable = await queryRunner.getTable('sub_categories');
    if (subCategoriesTable) {
      // Supprimer la contrainte de clé étrangère
      const foreignKey = subCategoriesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('category_id') !== -1,
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('sub_categories', foreignKey);
      }

      // Supprimer les index
      const indexes = subCategoriesTable.indices;
      for (const index of indexes) {
        await queryRunner.dropIndex('sub_categories', index);
      }

      await queryRunner.dropTable('sub_categories');
    }

    // Supprimer la table categories
    await queryRunner.dropTable('categories', true);
  }
}
