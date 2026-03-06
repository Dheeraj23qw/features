# Provider Adapters

The notification system uses a pluggable adapter pattern for delivering messages across different channels. Each provider implements the `NotificationProvider` interface.

## Defining a Provider

Create a provider class in `/providers` that implements the channel interface:

```typescript
export class SMSProviderStub implements NotificationProvider {
  channel = NotificationChannel.SMS;
  name = "SMSStub";

  async send(message: NotificationMessage): Promise<NotificationResult> {
    if (!message.phoneTarget) throw new Error("Missing Phone Target.");
    await externalSMSClient.dispatch({ number: message.phoneTarget });
    return { status: "sent", provider: this.name };
  }
}
```

## Provider Interface

```typescript
interface NotificationProvider {
  channel: NotificationChannel;
  name: string;
  send(message: NotificationMessage): Promise<NotificationResult>;
}
```

## Built-in Providers

| Provider | Channel | Description |
|----------|---------|-------------|
| `EmailProviderStub` | EMAIL | Email delivery via SMTP/API |
| `SMSProviderStub` | SMS | SMS delivery via Twilio/etc |
| `PushProviderStub` | PUSH | Push notifications via FCM/APNs |
| `WebhookProviderStub` | WEBHOOK | HTTP webhook delivery |
