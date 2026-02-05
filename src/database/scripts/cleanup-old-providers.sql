-- Script pour nettoyer les prestataires associés aux anciennes catégories
-- Conserver uniquement les prestataires liés aux 8 catégories correctes (id 161-168)

-- Étape 1: Identifier les anciens prestataires
-- Les prestataires qui n'ont que des liens avec les anciennes catégories (151-160)

-- Étape 2: Supprimer les liaisons prestataire-catégorie avec les anciennes catégories
DELETE FROM provider_categories 
WHERE provider_id IN (
  SELECT p.id FROM providers p
  WHERE NOT EXISTS (
    SELECT 1 FROM provider_categories pc
    WHERE pc.provider_id = p.id
    AND pc.category_id BETWEEN 161 AND 168
  )
);

-- Étape 3: Supprimer les prestataires qui n'ont aucune catégorie
DELETE FROM provider_category_photos 
WHERE provider_category_id IN (
  SELECT pc.id FROM provider_categories pc
  WHERE NOT EXISTS (
    SELECT 1 FROM provider_categories pc2
    WHERE pc2.provider_id = pc.provider_id
  )
);

DELETE FROM providers 
WHERE id NOT IN (
  SELECT DISTINCT provider_id FROM provider_categories
);

-- Afficher le résultat
SELECT 'Nettoyage terminé' as status;
SELECT COUNT(*) as final_providers_count FROM providers;
SELECT COUNT(*) as final_provider_categories FROM provider_categories;
