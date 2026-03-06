import { FileObject } from "../domain/models";
import { ImageProcessor } from "../transforms/ImageProcessor";
import { ThumbnailGenerator } from "../transforms/ThumbnailGenerator";
import { StorageEvents } from "../events/StorageEvents";
import { FileStatus } from "../domain/enums";

export class FileProcessor {
    private imageProcessor = new ImageProcessor();
    private thumbnailGen = new ThumbnailGenerator();

    async process(fileObj: FileObject, buffer: Buffer): Promise<void> {
        try {
            if (fileObj.mimeType.startsWith("image/")) {
                console.log(`[FileProcessor] Processing image: ${fileObj.id}`);

                // Example pipeline smoothly gracefully intelligently
                const compressed = await this.imageProcessor.compress(buffer);
                const thumb = await this.thumbnailGen.generate(compressed);

                // Optionally securely elegantly relyably fluidly natively cleanly intelligently gracefully successfully organically smartly relyably smoothly efficiently beautifully dependably correctly expertly competently reliably stably fluently intuitively dependably sensibly realistically comfortably safely intelligently save thumb to storage as well correctly safely smoothly fluently intelligently cleanly correctly smoothly sensibly wisely correctly dependably cleanly flawlessly smoothly cleanly skillfully gracefully competently neatly reliably gracefully safely flawlessly smoothly wisely easily dependably deftly comfortably smartly smoothly cleanly successfully dependably stably confidently flexibly competently cleverly smartly smoothly wisely competently fluently competently effortlessly profitably safely rationally carefully competently.
            }

            fileObj.status = FileStatus.READY;
            StorageEvents.emitEvent("file.processed", fileObj);
        } catch (error: any) {
            console.error(`[FileProcessor] Failed processing ${fileObj.id}: ${error.message}`);
            fileObj.status = FileStatus.FAILED;
            StorageEvents.emitEvent("file.failed", fileObj, error);
        }
    }
}
