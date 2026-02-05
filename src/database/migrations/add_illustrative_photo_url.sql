-- Migration SQL pour ajouter le champ illustrative_photo_url à la table provider_categories
-- Date: 2026-01-07

-- Vérifier si la colonne existe déjà avant de l'ajouter
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'provider_categories' 
        AND column_name = 'illustrative_photo_url'
    ) THEN
        ALTER TABLE provider_categories 
        ADD COLUMN illustrative_photo_url VARCHAR(500) NULL;
        
        RAISE NOTICE 'Colonne illustrative_photo_url ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne illustrative_photo_url existe déjà';
    END IF;
END $$;


