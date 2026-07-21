export interface CreateCustomerDTO {
  customerName: string;
  mobile: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: 'RETAIL' | 'WHOLESALE' | 'DISTRIBUTOR';
  status?: 'LEAD' | 'ACTIVE' | 'INACTIVE';
  address: string;
  followUpDate?: Date;
  notes?: string;
}
