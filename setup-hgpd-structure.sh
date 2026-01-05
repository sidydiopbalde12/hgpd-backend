#!/bin/bash

echo "🚀 Setup HGPD Backend Structure"
echo "================================"
echo ""

# Modules à créer
modules=(
    "organizers"
    "providers"
    "categories"
    "demands"
    "reviews"
    "support"
    "payments"
    "subscriptions"
    "sponsorships"
    "notifications"
)

# Créer les modules avec NestJS CLI
echo "📦 Création des modules NestJS..."
for module in "${modules[@]}"; do
    echo "  → ${module}"
    nest g module ${module} --no-spec
    nest g service ${module} --no-spec
    nest g controller ${module} --no-spec
done
echo ""

# Créer les dossiers entities manquants
echo "📁 Création des dossiers entities..."
for module in "${modules[@]}"; do
    mkdir -p "src/${module}/entities"
    mkdir -p "src/${module}/dto"
done
echo ""

# Créer les fichiers d'entités spécifiques
echo "📄 Création des fichiers d'entités..."

# Organizers
touch src/organizers/entities/organizer.entity.ts

# Providers (5 entités)
touch src/providers/entities/provider.entity.ts
touch src/providers/entities/provider-photo.entity.ts
touch src/providers/entities/provider-video.entity.ts
touch src/providers/entities/provider-category.entity.ts
touch src/providers/entities/provider-stats.entity.ts

# Categories (2 entités)
touch src/categories/entities/category.entity.ts
touch src/categories/entities/sub-category.entity.ts

# Demands (2 entités)
touch src/demands/entities/demand.entity.ts
touch src/demands/entities/demand-provider.entity.ts

# Reviews
touch src/reviews/entities/review.entity.ts

# Support
touch src/support/entities/support-request.entity.ts

# Payments
touch src/payments/entities/payment.entity.ts

# Subscriptions
touch src/subscriptions/entities/subscription.entity.ts

# Sponsorships
touch src/sponsorships/entities/sponsorship.entity.ts

# Notifications
touch src/notifications/entities/notification.entity.ts

# Database
mkdir -p src/database
touch src/database/entities.ts

echo ""
echo "✅ Structure HGPD créée avec succès !"
echo ""
echo "📊 Résumé:"
echo "  • $(ls -d src/*/ | wc -l) modules créés"
echo "  • $(find src -name "*.entity.ts" | wc -l) entités créées"
echo "  • $(find src -name "*.service.ts" | wc -l) services créés"
echo "  • $(find src -name "*.controller.ts" | wc -l) controllers créés"
echo ""
echo "🎯 Prochaines étapes:"
echo "  1. Copier le contenu des entités"
echo "  2. Copier le contenu des enums"
echo "  3. Générer les migrations TypeORM"
echo "  4. Lancer l'application"