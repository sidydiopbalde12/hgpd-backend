import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIllustrativePhotoUrlToProviderCategories1736294400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la colonne existe déjà
    const table = await queryRunner.getTable('provider_categories');
    const columnExists = table?.findColumnByName('illustrative_photo_url');

    if (!columnExists) {
      await queryRunner.addColumn(
        'provider_categories',
        new TableColumn({
          name: 'illustrative_photo_url',
          type: 'varchar',
          length: '500',
          isNullable: true,
        }),
      );
      console.log('✅ Colonne illustrative_photo_url ajoutée avec succès');
    } else {
      console.log('⚠️  La colonne illustrative_photo_url existe déjà');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la colonne si elle existe
    const table = await queryRunner.getTable('provider_categories');
    const columnExists = table?.findColumnByName('illustrative_photo_url');

    if (columnExists) {
      await queryRunner.dropColumn(
        'provider_categories',
        'illustrative_photo_url',
      );
      console.log('✅ Colonne illustrative_photo_url supprimée avec succès');
    } else {
      console.log("⚠️  La colonne illustrative_photo_url n'existe pas");
    }
  }
}
