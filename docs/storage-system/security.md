# Security & Validation

Data upload endpoints are notoriously vulnerable. The Storage Feature implements several defense layers natively.

## 1. FileValidator
Validates the payload against constraints set in the Zod configuration.
- **Size Limits**: Prevent DDoS or disk exhaustion by enforcing `MAX_UPLOAD_SIZE`.
- **MIME Type Allowlisting**: Only permits specific MIME types (`ALLOWED_IMAGE_MIMES`, `ALLOWED_DOCUMENT_MIMES`), preventing the execution of malicious HTML or scripts.

## 2. VirusScanner
A pluggable hook designed to scan buffers before they hit the disk or cloud. Implementations might include sending the buffer to a local ClamAV daemon or an external API. If the scan fails, the upload is immediately rejected.

## 3. Path Traversal & Filename Sanitization
User-provided filenames are extremely hazardous (e.g., `../../../etc/passwd`).
The `pathBuilder.ts` utility mitigates this by:
- Normalizing the path and stripping `../` or `/` characters.
- Replacing all potentially dangerous characters with hyphens.
- Appending a unique, randomized UUID to prevent collision/overwriting.

## 4. Integrity Checks (Checksums)
SHA-256 Hashes are generated for every file via `fileHash.ts`. These hashes are persisted to the `MetadataStore` and can be used to:
- Verify file integrity upon download.
- Deduplicate identical uploads.
