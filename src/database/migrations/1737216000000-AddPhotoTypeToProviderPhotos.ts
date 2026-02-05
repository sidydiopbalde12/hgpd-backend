import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhotoTypeToProviderPhotos1737216000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la colonne existe déjà avant de l'ajouter
    const table = await queryRunner.getTable('provider_photos');
    const hasPhotoTypeColumn = table?.columns.some(
      (col) => col.name === 'photo_type',
    );

    if (!hasPhotoTypeColumn) {
      await queryRunner.addColumn(
        'provider_photos',
        new TableColumn({
          name: 'photo_type',
          type: 'enum',
          enum: ['profile', 'service'],
          default: "'service'",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('provider_photos');
    const hasPhotoTypeColumn = table?.columns.some(
      (col) => col.name === 'photo_type',
    );

    if (hasPhotoTypeColumn) {
      await queryRunner.dropColumn('provider_photos', 'photo_type');
    }
  }
}
