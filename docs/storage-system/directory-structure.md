# Directory Structure

The File Storage Feature is completely encapsulated under `src/features/storage/`.

```text
storage/
├── api/                  # Public API functions (upload, delete, getUrl)
├── domain/               # Core data models and Enums
│   ├── enums.ts
│   └── models.ts
├── events/               # Decoupled Node.js Event Emitter
│   └── StorageEvents.ts
├── logger/               # Structured JSON logger observing events
│   └── StorageLogger.ts
├── metadata/             # Metadata Storage Adapters
│   └── MetadataStore.ts
├── providers/            # Cloud & Local Storage Adapters
│   ├── StorageProvider.ts
│   ├── LocalProvider.ts
│   ├── S3Provider.ts
│   └── R2Provider.ts
├── queue/                # Background Processing
│   └── ProcessingQueue.ts
├── security/             # Pre-upload validation & scanning
│   ├── FileValidator.ts
│   └── VirusScanner.ts
├── services/             # Core Orchestration Singletons
│   ├── StorageService.ts
│   └── FileProcessor.ts
├── transforms/           # File Manipulation Tools
│   ├── ImageProcessor.ts
│   └── ThumbnailGenerator.ts
├── types/                # TypeScript Type Definitions
│   └── index.ts
├── utils/                # Small pure functions
│   ├── config.ts         # Zod environment configuration
│   ├── errors.ts         # Custom Error classes
│   ├── fileHash.ts       # Checksummer
│   └── pathBuilder.ts    # Secure File Path Generator
└── index.ts              # Public API Export Boundary
```
