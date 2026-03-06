# Queue & Processing System

Large files require significant CPU time to process (e.g., generating thumbnails or compressing images). To prevent blocking the main Node.js event loop or HTTP request, these tasks are offloaded to an asynchronous `ProcessingQueue`.

## Queue Mechanics

1. **Enqueuing**: The `StorageService` drops a `Job` (containing the file metadata and original buffer) into the `ProcessingQueue` immediately after saving the original payload to the provider. The HTTP request can then complete and return to the user.
2. **Polling Hook**: A background hook checks the queue interval repeatedly.
3. **Execution**: The queue hands the job to the `FileProcessor`.
4. **Retry Strategy**: If a processing task fails, the queue automatically attempts a retry using **Exponential Backoff** (`Math.pow(2, attempts) * 1000`), up to a maximum of 3 attempts.
5. **Permanent Failure**: If all retries are exhausted, the job is marked as failed, and a `file.failed` event is emitted.

## File Processor & Transforms

The `FileProcessor` acts as the router for different file types. 
- For Images: It routes the buffer through the `ImageProcessor` for compression, and the `ThumbnailGenerator` to create smaller versions.
- Extensibility: You can add video transcoders, document parsers (PDF to text), or AI labeling hooks here without modifying the core `StorageService`.
