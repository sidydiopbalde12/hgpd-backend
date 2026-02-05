import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsActiveAndOtherColumnsToCategoriesAndSubCategories1736294400002 implements MigrationInterface {
  name = 'AddIsActiveAndOtherColumnsToCategoriesAndSubCategories1736294400002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ajouter isActive à la table categories s'il n'existe pas
    const categoriesTable = await queryRunner.getTable('categories');
    if (categoriesTable && !categoriesTable.findColumnByName('isActive')) {
      await queryRunner.addColumn(
        'categories',
        new TableColumn({
          name: 'isActive',
          type: 'boolean',
          default: true,
          isNullable: false,
        }),
      );
    }

    // Ajouter les colonnes manquantes à la table sub_categories
    const subCategoriesTable = await queryRunner.getTable('sub_categories');

    if (
      subCategoriesTable &&
      !subCategoriesTable.findColumnByName('isActive')
    ) {
      await queryRunner.addColumn(
        'sub_categories',
        new TableColumn({
          name: 'isActive',
          type: 'boolean',
          default: true,
          isNullable: false,
        }),
      );
    }

    if (
      subCategoriesTable &&
      !subCategoriesTable.findColumnByName('isDefault')
    ) {
      await queryRunner.addColumn(
        'sub_categories',
        new TableColumn({
          name: 'isDefault',
          type: 'boolean',
          default: false,
          isNullable: false,
        }),
      );
    }

    if (
      subCategoriesTable &&
      !subCategoriesTable.findColumnByName('updated_at')
    ) {
      await queryRunner.addColumn(
        'sub_categories',
        new TableColumn({
          name: 'updated_at',
          type: 'timestamp with time zone',
          default: 'CURRENT_TIMESTAMP',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: Supprimer les colonnes ajoutées
    const categoriesTable = await queryRunner.getTable('categories');
    if (categoriesTable && categoriesTable.findColumnByName('isActive')) {
      await queryRunner.dropColumn('categories', 'isActive');
    }

    const subCategoriesTable = await queryRunner.getTable('sub_categories');
    if (subCategoriesTable && subCategoriesTable.findColumnByName('isActive')) {
      await queryRunner.dropColumn('sub_categories', 'isActive');
    }

    if (
      subCategoriesTable &&
      subCategoriesTable.findColumnByName('isDefault')
    ) {
      await queryRunner.dropColumn('sub_categories', 'isDefault');
    }

    if (
      subCategoriesTable &&
      subCategoriesTable.findColumnByName('updated_at')
    ) {
      await queryRunner.dropColumn('sub_categories', 'updated_at');
    }
  }
}
