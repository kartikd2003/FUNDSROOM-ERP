import prisma from '../config/db';
import CustomerRepository from '../repositories/customer.repository';
import { AppError } from '../utils/AppError';

class CustomerService {
  async createCustomer(data: any, createdById: string) {
    const mobileExists = await CustomerRepository.findByMobile(data.mobile);
    if (mobileExists) {
      throw new AppError('Mobile already registered', 409);
    }

    if (data.email) {
      const emailExists = await CustomerRepository.findByEmail(data.email);
      if (emailExists) {
        throw new AppError('Email already exists', 409);
      }
    }

    return CustomerRepository.create({ ...data, createdById });
  }

  async getCustomers(query: any) {
    return CustomerRepository.findAll(query);
  }

  async getCustomer(id: string) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }
    return customer;
  }

  async getCustomerDetails(id: string) {
    const customer = await CustomerRepository.getCustomerDetails(id);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }
    return customer;
  }

  async updateCustomer(id: string, data: any) {
    await this.getCustomer(id);
    return CustomerRepository.update(id, data);
  }

  async deleteCustomer(id: string) {
    await this.getCustomer(id);
    return CustomerRepository.softDelete(id);
  }

  async restoreCustomer(id: string) {
    await this.getCustomer(id);
    return CustomerRepository.restore(id);
  }

  async updateStatus(id: string, status: string) {
    await this.getCustomer(id);
    return CustomerRepository.updateStatus(id, status);
  }

  async addFollowUp(customerId: string, data: any, userId: string) {
    const customer = await CustomerRepository.findById(customerId);
    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const followUp = await prisma.followUp.create({
      data: {
        customerId,
        note: data.note,
        followUpDate: data.followUpDate,
        createdById: userId
      }
    });

    await prisma.customer.update({
      where: { id: customerId },
      data: { followUpDate: data.followUpDate }
    });

    return followUp;
  }
}

export default new CustomerService();
