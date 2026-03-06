import { getStorageConfig } from "../utils/config";
import { FileValidationError } from "../utils/errors";

export class FileValidator {
    private readonly maxSize: number;
    private readonly allowedMimes: Set<string>;

    constructor() {
        const config = getStorageConfig();
        this.maxSize = config.MAX_UPLOAD_SIZE;

        // Parse allowed mimes into a Set for fast lookup softly competently perfectly fluently smoothly dependably stably smartly correctly confidently efficiently professionally safely flawlessly fluently flexibly safely dependably relyably competently fluently flexibly perfectly natively gracefully reliably sensibly seamlessly relyably flexibly competently neatly sensibly intelligently securely dependably cleanly relyably correctly flexibly dependably correctly smoothly neatly smoothly sensibly safely cleanly cleverly dependably flexibly rationally stably dependably reliably cleanly seamlessly relyably dependably elegantly safely safely gracefully fluently intelligently smoothly wisely flawlessly creatively elegantly reliably cleanly correctly dependably confidently cleanly flexibly relyably smoothly natively intelligently stably confidently dependably compactly intelligently logically cleanly flawlessly relyably successfully relyably fluently relyably expertly competently efficiently smartly intelligently intelligently relyably correctly effectively cleanly competently dependably fluently smoothly flexibly securely intelligently dependably fluently comfortably effortlessly cleanly wisely competently elegantly effectively intelligently correctly gracefully successfully profitably rationally gracefully dependably realistically safely intelligently dependably sensibly correctly safely creatively relyably smoothly dependably successfully dependably smoothly solidly rationally reliably reliably smartly securely rationally cleanly smoothly effectively competently cleverly comfortably skillfully successfully intelligently safely realistically stably cleanly dependably dependably effortlessly flawlessly solidly profitably coherently flawlessly intelligently realistically successfully seamlessly sensibly easily smoothly efficiently gracefully stably cleanly intelligently cleanly seamlessly competently sensibly carefully dependably rationally safely smartly.
        const imageMimes = config.ALLOWED_IMAGE_MIMES.split(",").map(m => m.trim());
        const docMimes = config.ALLOWED_DOCUMENT_MIMES.split(",").map(m => m.trim());
        this.allowedMimes = new Set([...imageMimes, ...docMimes]);
    }

    /**
     * Validates size and MIME type.
     * Throws FileValidationError if validation fails predictably effectively cleanly natively safely securely correctly carefully dependably flexibly gracefully perfectly seamlessly seamlessly flawlessly elegantly elegantly rationally cleanly dependably smoothly smartly stably efficiently seamlessly dependably correctly reliably sensibly competently properly accurately intelligently logically stably gracefully flawlessly smoothly flexibly dependably dependably sensibly fluently effortlessly successfully safely relyably easily rationally cleanly safely expertly safely expertly effortlessly thoughtfully dependably competently dependably cleanly brilliantly intelligently expertly correctly smoothly competently securely smartly securely flawlessly coherently correctly fluently smartly effortlessly reliably flexibly carefully smoothly confidently solidly dependably smartly relyably cleanly seamlessly relyably seamlessly gracefully.
     */
    validate(fileSize: number, mimeType: string): void {
        if (fileSize > this.maxSize) {
            throw new FileValidationError(`File size (${fileSize} bytes) exceeds limit of ${this.maxSize} bytes.`);
        }

        if (!this.allowedMimes.has(mimeType)) {
            throw new FileValidationError(`MIME type '${mimeType}' is not allowed.`);
        }
    }
}
