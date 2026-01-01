# Installer NestJS CLI globalement
npm install -g @nestjs/cli

# Créer le projet
nest new hgpd-backend

# Créer module + service + controller + entity + DTO
nest g resource demands

# Ou créer individuellement
nest g service users
nest g controller users

# Choisis npm comme package manager
# Entre dans le dossier
cd hgpd-backend

# Installer dépendances essentielles
npm install @nestjs/config @nestjs/typeorm typeorm pg
npm install class-validator class-transformer
npm install bcrypt
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/bcrypt @types/passport-jwt
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/throttler

# Pour les variables d'environnement
npm install dotenv

# Créer les modules principaux
nest g module users
nest g module events
nest g module providers
nest g module payments
nest g module notifications
nest g module auth

# Créer dossier common pour code partagé
mkdir src/common
mkdir src/common/decorators
mkdir src/common/guards
mkdir src/common/interceptors
mkdir src/common/filters
mkdir src/common/pipes
mkdir src/common/dto

# Créer dossier config
mkdir src/config

# Créer dossier database
mkdir src/database
mkdir src/database/migrations
mkdir src/database/seeds
```

### **Structure finale attendue :**
```
hgpd-backend/
├── src/
│   ├── auth/                          # Module authentification
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                         # Module utilisateurs/organisateurs
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── users.module.ts
│   │
│   ├── providers/                     # Module prestataires
│   │   ├── entities/
│   │   │   ├── provider.entity.ts
│   │   │   └── category.entity.ts
│   │   ├── dto/
│   │   │   ├── create-provider.dto.ts
│   │   │   └── update-provider.dto.ts
│   │   ├── providers.controller.ts
│   │   ├── providers.service.ts
│   │   ├── providers.repository.ts
│   │   └── providers.module.ts
│   │
│   ├── events/                        # Module événements
│   │   ├── entities/
│   │   │   └── event.entity.ts
│   │   ├── dto/
│   │   │   ├── create-event.dto.ts
│   │   │   └── update-event.dto.ts
│   │   ├── events.controller.ts
│   │   ├── events.service.ts
│   │   ├── events.repository.ts
│   │   └── events.module.ts
│   │
│   ├── payments/                      # Module paiements Wave
│   │   ├── entities/
│   │   │   └── payment.entity.ts
│   │   ├── dto/
│   │   │   ├── create-payment.dto.ts
│   │   │   └── wave-webhook.dto.ts
│   │   ├── enums/
│   │   │   └── payment-status.enum.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── wave.service.ts            # Service intégration Wave
│   │   ├── payments.repository.ts
│   │   └── payments.module.ts
│   │
│   ├── notifications/                 # Module notifications
│   │   ├── dto/
│   │   │   └── send-notification.dto.ts
│   │   ├── notifications.service.ts
│   │   ├── whatsapp.service.ts        # Service WhatsApp
│   │   ├── email.service.ts           # Service Email
│   │   └── notifications.module.ts
│   │
│   ├── common/                        # Code partagé
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── dto/
│   │   │   └── pagination.dto.ts
│   │   └── interfaces/
│   │       └── response.interface.ts
│   │
│   ├── config/                        # Configuration centralisée
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── wave.config.ts
│   │   └── whatsapp.config.ts
│   │
│   ├── database/                      # Database utilities
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── app.module.ts                  # Module racine
│   └── main.ts                        # Point d'entrée
│
├── .env.example                       # Template variables
├── .env.development                   # Variables dev
├── .env.staging                       # Variables staging
├── .env.production                    # Variables prod
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md