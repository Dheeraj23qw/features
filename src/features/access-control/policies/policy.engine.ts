import { AccessContext, ResourceContext } from "../domain/models";

export interface PolicyCondition {
  evaluate(context: PolicyContext): boolean;
}

export interface PolicyContext {
  userId: string;
  roles: string[];
  permissions: string[];
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  action: string;
  resourceType: string;
  resourceContext?: ResourceContext;
}

export type PolicyEvaluator = (context: PolicyContext) => boolean | Promise<boolean>;

export interface Policy {
  name: string;
  description?: string;
  resource: string;
  action: string;
  evaluator: PolicyEvaluator;
  enabled?: boolean;
}

export class PolicyEngine {
  private policies: Map<string, Policy> = new Map();

  register(policy: Policy): void {
    const key = this.getPolicyKey(policy.resource, policy.action);
    this.policies.set(key, policy);
  }

  unregister(resource: string, action: string): void {
    const key = this.getPolicyKey(resource, action);
    this.policies.delete(key);
  }

  getPolicy(resource: string, action: string): Policy | undefined {
    const key = this.getPolicyKey(resource, action);
    return this.policies.get(key);
  }

  getAllPolicies(): Policy[] {
    return Array.from(this.policies.values());
  }

  async evaluate(
    action: string,
    resource: string,
    context: AccessContext,
    resourceContext?: ResourceContext
  ): Promise<boolean> {
    const policy = this.getPolicy(resource, action);

    if (!policy) {
      return true;
    }

    if (policy.enabled === false) {
      return true;
    }

    const policyContext: PolicyContext = {
      userId: context.userId,
      roles: context.roles,
      permissions: context.permissions,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
      action,
      resourceType: resource,
      resourceContext,
    };

    try {
      return await policy.evaluator(policyContext);
    } catch (error) {
      console.error(`Policy ${policy.name} failed:`, error);
      return false;
    }
  }

  enable(resource: string, action: string): void {
    const policy = this.getPolicy(resource, action);
    if (policy) {
      policy.enabled = true;
    }
  }

  disable(resource: string, action: string): void {
    const policy = this.getPolicy(resource, action);
    if (policy) {
      policy.enabled = false;
    }
  }

  private getPolicyKey(resource: string, action: string): string {
    return `${resource}:${action}`;
  }
}

export const policyEngine = new PolicyEngine();
