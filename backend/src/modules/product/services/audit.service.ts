import auditRepository from '../repositories/audit.repository';

class AuditService {
  async getLogs() {
    const logs = await auditRepository.getAuditLogs();
    return logs.map((log: any) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType || 'PRODUCT',
      entityId: log.productId,
      description: log.description || `${log.action.replace(/_/g, ' ')} for ${log.product?.productName || 'Unknown'}`,
      productName: log.product?.productName,
      sku: log.product?.sku,
      oldValue: log.oldValue,
      newValue: log.newValue,
      createdAt: log.createdAt
    }));
  }
}

export default new AuditService();

