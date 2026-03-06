# Observability

The Storage Module is fully instrumented using an Event-Driven architecture to decouple logging and analytics from core business logic.

## StorageEvents

A Node.js `EventEmitter` dedicated explicitly to file storage lifecycle events.

**Events emitted:**
- `file.uploaded` - Fired successfully after the object and metadata are saved.
- `file.deleted` - Fired after an object is securely removed.
- `file.processed` - Fired by the `FileProcessor` when background tasks (like thumbnails) successfully complete.
- `file.failed` - Fired if upload, processing, or deletion encounters a critical error.

## StorageLogger

Automatically subscribes to all `StorageEvents` and logs structured JSON telemetry to stdout.

Example Log:
```json
{
  "level": "info",
  "timestamp": "2026-03-05T12:00:00.000Z",
  "module": "file_storage",
  "event": "file.uploaded",
  "fileId": "6c4f0b2a-1123-...",
  "filename": "document.pdf",
  "mime": "application/pdf",
  "size": 1048576,
  "provider": "s3",
  "error": null
}
```

This strict JSON structure enables rapid ingestion and querying in platforms like Datadog, ELK, or CloudWatch.
