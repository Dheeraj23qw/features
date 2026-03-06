import { EmailMessage } from "../domain/models";

export const buildOpenTrackingPixel = (messageId: string): string => {
    const trackingUrl = `https://api.yourdomain.com/v1/emails/track/open?msg=${messageId}`;
    return `<img src="${trackingUrl}" width="1" height="1" alt="" />`;
};

export const wrapLinksForClickTracking = (html: string, messageId: string): string => {
    // A naive implementation to wrap all href links with a click tracking redirect proxy.
    const trackingProxyUrl = `https://api.yourdomain.com/v1/emails/track/click?msg=${messageId}&url=`;
    return html.replace(/href="([^"]*)"/g, (match, p1) => {
        return `href="${trackingProxyUrl}${encodeURIComponent(p1)}"`;
    });
};

export const injectTrackingHooks = (message: EmailMessage, messageId: string): EmailMessage => {
    if (message.html) {
        message.html = wrapLinksForClickTracking(message.html, messageId);
        message.html += buildOpenTrackingPixel(messageId);
    }
    return message;
};
