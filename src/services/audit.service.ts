import { prisma } from "@/lib/db";

export class AuditService {
  /**
   * Records an administrative action in the forensic audit log.
   */
  static async logAction(params: {
    adminId: string;
    action: string;
    targetId?: string;
    metadata?: any;
  }) {
    return await prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetId: params.targetId,
        metadata: params.metadata,
      },
    });
  }

  /**
   * Retrieves audit logs for a specific user or action type.
   */
  static async getLogs(filter: { userId?: string; action?: string; limit?: number }) {
    return await prisma.auditLog.findMany({
      where: {
        targetId: filter.userId,
        action: filter.action,
      },
      orderBy: { createdAt: "desc" },
      take: filter.limit || 50,
    });
  }
}
