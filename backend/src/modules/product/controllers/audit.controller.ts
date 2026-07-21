import { Request, Response } from 'express';
import auditService from '../services/audit.service';

class AuditController {
  async getLogs(req: Request, res: Response) {
    try {
      const data = await auditService.getLogs();
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AuditController();

