import { Request, Response } from 'express';
import CustomerService from '../services/customer.service';

class CustomerController {
  async createCustomer(req: Request, res: Response) {
    try {
      const customer = await CustomerService.createCustomer(req.body, (req as any).user.id);
      return res.status(201).json({ success: true, message: 'Customer created successfully', data: customer });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getCustomers(req: Request, res: Response) {
    try {
      const result = await CustomerService.getCustomers(req.query as any);
      return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.getCustomer(id);
      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async getCustomerDetails(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.getCustomerDetails(id);
      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(error.status || 404).json({ success: false, message: error.message });
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.updateCustomer(id, req.body);
      return res.status(200).json({ success: true, message: 'Customer updated', data: customer });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async deleteCustomer(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await CustomerService.deleteCustomer(id);
      return res.status(200).json({ success: true, message: 'Customer deleted successfully' });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async restoreCustomer(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.restoreCustomer(id);
      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const customer = await CustomerService.updateStatus(id, req.body.status);
      return res.status(200).json({ success: true, data: customer });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }

  async addFollowUp(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const followUp = await CustomerService.addFollowUp(id, req.body, (req as any).user.id);
      return res.status(201).json({ success: true, message: 'Follow-up added successfully', data: followUp });
    } catch (error: any) {
      return res.status(error.status || 400).json({ success: false, message: error.message });
    }
  }
}

export default new CustomerController();
