# Architecture

The system follows a strict layered architecture pattern.

## Diagram

```mermaid
flowchart TD
    Client((Client API Call)) --> API(Public API: uploadFile)
    
    subgraph Core
        API --> Service[StorageService Singleton]
        Service --> Validator[FileValidator]
        Service --> Scanner[VirusScanner]
        Service --> Hash[Hash Generator]
    end
    
    subgraph Adapters
        Service --> |Stores Metadata| MetaStore[(MetadataStore)]
        Service --> |Uploads Blob| Provider{StorageProvider}
        
        Provider --> Local[LocalProvider]
        Provider --> S3[S3Provider]
        Provider --> R2[R2Provider]
    end
    
    subgraph Async Processing
        Service --> |Enqueues| Queue[ProcessingQueue]
        Queue --> Processor[FileProcessor]
        Processor --> Image[ImageProcessor]
        Processor --> Thumb[ThumbnailGenerator]
        Image --> |Updates| Provider
    end
    
    subgraph Observability
        Service -.-> Events((StorageEvents))
        Processor -.-> Events
        Events --> Logger[StorageLogger]
    end
```

## Layers

1. **API Layer (`src/features/storage/api/`)**: Extremely thin wrappers around the `StorageService`. Provides the public boundary.
2. **Service Layer (`src/features/storage/services/`)**: Orchestrates the workflow. Validates the file, calculates hashes, pushes to the provider, saves metadata, and enqueues jobs.
3. **Provider Layer (`src/features/storage/providers/`)**: The physical adapters connecting to real-world infrastructure (Disk, S3, R2).
4. **Processing Layer (`src/features/storage/transforms/`)**: Dedicated classes for manipulating buffers (e.g., resizing images).
