# Policy Engine

The Policy Engine allows custom authorization rules beyond basic permissions.

## Overview

Policies run **after** permission checks and can enforce contextual rules like:
- Users can only update their own profile
- Admins can only delete content in their department
- Access only during business hours

## Registering Policies

```typescript
import { policyEngine } from "@/features/access-control/policies/policy.engine";

policyEngine.register({
  name: "owner-only",
  description: "Users can only update their own resources",
  resource: "USER",
  action: "UPDATE",
  evaluator: (context) => {
    return context.userId === context.resourceContext?.resourceOwnerId;
  },
});
```

## Policy Context

```typescript
interface PolicyContext {
  userId: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  action: string;
  resourceType: string;
  resourceContext?: {
    resourceType: string;
    resourceId?: string;
    resourceOwnerId?: string;
    [key: string]: unknown;
  };
}
```

## Using Policies with AccessControl

The policy engine integrates with `AccessControlService.can()`:

```typescript
const canUpdate = await accessControl.can(
  userId,
  "UPDATE",
  "USER",
  { resourceOwnerId: targetUserId }
);
```

## Enabling/Disabling Policies

```typescript
policyEngine.disable("USER", "UPDATE");
policyEngine.enable("USER", "UPDATE");
```

## Common Policy Examples

### Owner-Only Update

```typescript
policyEngine.register({
  resource: "USER",
  action: "UPDATE",
  evaluator: (ctx) => ctx.userId === ctx.resourceContext?.resourceOwnerId,
});
```

### Time-Based Access

```typescript
policyEngine.register({
  resource: "REPORT",
  action: "READ",
  evaluator: (ctx) => {
    const hour = new Date().getHours();
    return hour >= 9 && hour < 17; // Business hours only
  },
});
```

### IP-Based Restriction

```typescript
policyEngine.register({
  resource: "ADMIN",
  action: "*",
  evaluator: (ctx) => {
    return ctx.ipAddress?.startsWith("10.0.0.");
  },
});
```

## Policy Engine API

```typescript
const engine = new PolicyEngine();

engine.register(policy);
engine.unregister(resource, action);
engine.getPolicy(resource, action);
engine.getAllPolicies();
engine.evaluate(action, resource, context);
engine.enable(resource, action);
engine.disable(resource, action);
```
