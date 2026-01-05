┌──────────────────────────┐
│      ORGANIZERS          │ (Pas de compte authentifié)
├──────────────────────────┤
│ id (PK)                  │
│ firstName                │
│ lastName                 │
│ phone                    │
│ email (nullable)         │
│ department               │
│ commune                  │
│ createdAt                │
└──────────────────────────┘
         │
         │ 1:N
         ▼
┌──────────────────────────┐
│        DEMANDS           │
├──────────────────────────┤
│ id (PK)                  │
│ organizerId (FK)         │
│ contactName              │
│ eventNature              │
│ eventDate                │
│ approximateGuests        │
│ location                 │
│ geographicZone           │
│ budget                   │
│ additionalInfo           │
│ status (12 valeurs)      │
│ createdAt                │
│ updatedAt                │
└──────────────────────────┘
         │
         │ N:N
         ▼
┌──────────────────────────┐
│    DEMAND_PROVIDERS      │
├──────────────────────────┤
│ id (PK)                  │
│ demandId (FK)            │
│ providerId (FK)          │
│ status (enum)            │
│ providerResponse         │
│ convertedToMission       │
│ nonConversionReason      │
│ nonConversionComment     │
│ contactUnlockedAt        │
│ paymentId (FK)           │
│ createdAt                │
│ updatedAt                │
└──────────────────────────┘
         │
         │ N:1
         ▼
┌──────────────────────────┐        ┌──────────────────────────┐
│      PROVIDERS           │        │    PROVIDER_CATEGORIES   │
├──────────────────────────┤        ├──────────────────────────┤
│ id (PK)                  │────N:N─│ id (PK)                  │
│ firstName                │        │ providerId (FK)          │
│ lastName                 │        │ categoryId (FK)          │
│ companyName              │        │ subCategoryId (FK)       │
│ activity                 │        └──────────────────────────┘
│ department               │                 │
│ commune                  │                 │ N:1
│ phone                    │                 ▼
│ email (nullable)         │        ┌──────────────────────────┐
│ password (hashed)        │        │      CATEGORIES          │
│ identityDocType          │        ├──────────────────────────┤
│ identityDocNumber        │        │ id (PK)                  │
│ emailVerifiedAt          │        │ name                     │
│ phoneVerifiedAt          │        │ slug                     │
│ isActive                 │        │ displayOrder             │
│ showPhoneNumber          │        └──────────────────────────┘
│ createdAt                │                 │ 1:N
│ updatedAt                │                 ▼
└──────────────────────────┘        ┌──────────────────────────┐
         │                          │    SUB_CATEGORIES        │
         │ 1:N                      ├──────────────────────────┤
         ▼                          │ id (PK)                  │
┌──────────────────────────┐        │ categoryId (FK)          │
│   PROVIDER_PHOTOS        │        │ name                     │
├──────────────────────────┤        │ slug                     │
│ id (PK)                  │        └──────────────────────────┘
│ providerId (FK)          │
│ url                      │
│ isMain                   │
│ displayOrder             │
│ createdAt                │
└──────────────────────────┘

┌──────────────────────────┐
│   PROVIDER_VIDEOS        │
├──────────────────────────┤
│ id (PK)                  │
│ providerId (FK)          │
│ url                      │
│ displayOrder             │
│ createdAt                │
└──────────────────────────┘

┌──────────────────────────┐        ┌──────────────────────────┐
│      REVIEWS             │        │   PROVIDER_STATS         │
├──────────────────────────┤        ├──────────────────────────┤
│ id (PK)                  │        │ id (PK)                  │
│ demandProviderId (FK)    │        │ providerId (FK)          │
│ organizerId (FK)         │        │ demandsReceived          │
│ providerId (FK)          │        │ missionsCompleted        │
│ globalRating (1-5)       │        │ completionRate           │
│ punctuality (0/1)        │        │ revenueGenerated         │
│ respectCommunication (0/1)│        │ profileViews             │
│ requestCompliance (0/1)  │        │ lastUpdated              │
│ serviceQuality (0/1)     │        └──────────────────────────┘
│ regrettableIncident (0/1)│
│ wouldRecommend (bool)    │
│ comment (nullable)       │
│ createdAt                │
└──────────────────────────┘

┌──────────────────────────┐
│   SUPPORT_REQUESTS       │
├──────────────────────────┤
│ id (PK)                  │
│ providerId (FK)          │
│ subject (enum)           │
│ description              │
│ preferredContact         │
│ status                   │
│ createdAt                │
│ resolvedAt               │
└──────────────────────────┘

┌──────────────────────────┐        ┌──────────────────────────┐
│     SUBSCRIPTIONS        │        │     SPONSORSHIPS         │
├──────────────────────────┤        ├──────────────────────────┤
│ id (PK)                  │        │ id (PK)                  │
│ providerId (FK)          │        │ providerId (FK)          │
│ plan (enum)              │        │ categoryId (FK)          │
│ startDate                │        │ budget                   │
│ endDate                  │        │ startDate                │
│ status                   │        │ endDate                  │
│ amount                   │        │ status                   │
│ waveTransactionId        │        │ createdAt                │
│ createdAt                │        └──────────────────────────┘
└──────────────────────────┘

┌──────────────────────────┐
│       PAYMENTS           │
├──────────────────────────┤
│ id (PK)                  │
│ providerId (FK)          │
│ demandProviderId (FK)    │
│ amount                   │
│ currency                 │
│ waveTransactionId        │
│ status                   │
│ paidAt                   │
│ createdAt                │
└──────────────────────────┘