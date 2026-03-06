# Domain Models

## NotificationMessage

The core domain model defining notification payloads.

```typescript
export interface NotificationMessage {
  id: string;                               
  userId?: string;                          
  channels: NotificationChannel[];          
  title?: string;
  body?: string;
  template?: string;                        
  data?: Record<string, any>;               

  priority?: NotificationPriority;           
  metadata?: Record<string, any>;           

  scheduleAt?: Date;                        
  retryAttempts?: number;                   

  emailTarget?: string;
  phoneTarget?: string;
  pushToken?: string;
  webhookUrl?: string;
}
```

## NotificationChannel

```typescript
export enum NotificationChannel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  PUSH = "PUSH",
  WEBHOOK = "WEBHOOK"
}
```

## NotificationPriority

```typescript
export enum NotificationPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3
}
```

## Configuration

```typescript
{
  NOTIFICATION_QUEUE_CONCURRENCY: 5
  NOTIFICATION_RETRY_ATTEMPTS: 3
  NOTIFICATION_QUEUE_STORE: "memory"
}
```
