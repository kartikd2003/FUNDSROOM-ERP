import prisma from '../config/db';

const CUSTOMERS = [
  { name: 'Rajesh Sharma', business: 'Sharma Electronics', mobile: '9876543210', email: 'rajesh@sharmaelectronics.com', status: 'ACTIVE', followUp: '2026-07-25' },
  { name: 'Priya Patel', business: 'Patel Traders', mobile: '9876543211', email: 'priya@pateltraders.com', status: 'ACTIVE', followUp: '2026-07-24' },
  { name: 'Amit Verma', business: 'Verma Enterprises', mobile: '9876543212', email: 'amit@vermaenterprises.com', status: 'LEAD', followUp: '2026-07-28' },
  { name: 'Neha Gupta', business: 'Gupta Fashion House', mobile: '9876543213', email: 'neha@guptafashion.com', status: 'ACTIVE', followUp: '2026-07-30' },
  { name: 'Rohit Jain', business: 'Jain Stationers', mobile: '9876543214', email: 'rohit@jainstationers.com', status: 'INACTIVE', followUp: '2026-08-02' },
  { name: 'Sneha Mishra', business: 'Mishra Medical Store', mobile: '9876543215', email: 'sneha@mishramedical.com', status: 'ACTIVE', followUp: '2026-07-26' },
  { name: 'Arjun Singh', business: 'Singh Hardware', mobile: '9876543216', email: 'arjun@singhhardware.com', status: 'LEAD', followUp: '2026-08-01' },
  { name: 'Pooja Yadav', business: 'Yadav Furnitures', mobile: '9876543217', email: 'pooja@yadavfurniture.com', status: 'ACTIVE', followUp: '2026-07-27' },
  { name: 'Vivek Agarwal', business: 'Agarwal Distributors', mobile: '9876543218', email: 'vivek@agarwaldist.com', status: 'ACTIVE', followUp: '2026-07-29' },
  { name: 'Anjali Mehta', business: 'Mehta Garments', mobile: '9876543219', email: 'anjali@mehtagarments.com', status: 'INACTIVE', followUp: '2026-08-05' },
  { name: 'Karan Malhotra', business: 'KM Computers', mobile: '9876543220', email: 'karan@kmcomputers.com', status: 'ACTIVE', followUp: '2026-07-31' },
  { name: 'Nitin Joshi', business: 'Joshi Mobiles', mobile: '9876543221', email: 'nitin@joshimobiles.com', status: 'LEAD', followUp: '2026-08-03' },
  { name: 'Deepak Soni', business: 'Soni Jewellers', mobile: '9876543222', email: 'deepak@sonijewellers.com', status: 'ACTIVE', followUp: '2026-07-28' },
  { name: 'Ritu Choudhary', business: 'Choudhary Agro', mobile: '9876543223', email: 'ritu@choudharyagro.com', status: 'ACTIVE', followUp: '2026-08-04' },
  { name: 'Sandeep Kumar', business: 'Kumar Auto Parts', mobile: '9876543224', email: 'sandeep@kumarauto.com', status: 'LEAD', followUp: '2026-07-26' },
  { name: 'Akash Tiwari', business: 'Tiwari Electronics', mobile: '9876543225', email: 'akash@tiwarielectronics.com', status: 'ACTIVE', followUp: '2026-07-25' },
  { name: 'Kavita Shah', business: 'Shah Textiles', mobile: '9876543226', email: 'kavita@shahtextiles.com', status: 'ACTIVE', followUp: '2026-07-29' },
  { name: 'Mohit Saxena', business: 'Saxena Printers', mobile: '9876543227', email: 'mohit@saxenaprinters.com', status: 'INACTIVE', followUp: '2026-08-06' },
  { name: 'Rahul Dubey', business: 'Dubey Traders', mobile: '9876543228', email: 'rahul@dubeytraders.com', status: 'ACTIVE', followUp: '2026-07-30' },
  { name: 'Simran Kaur', business: 'Kaur Boutique', mobile: '9876543229', email: 'simran@kaurboutique.com', status: 'LEAD', followUp: '2026-08-02' },
  { name: 'Abhishek Rao', business: 'Rao Technologies', mobile: '9876543230', email: 'abhishek@raotech.com', status: 'ACTIVE', followUp: '2026-07-27' },
  { name: 'Divya Arora', business: 'Arora Bakers', mobile: '9876543231', email: 'divya@arorabakers.com', status: 'ACTIVE', followUp: '2026-07-31' },
  { name: 'Manish Bansal', business: 'Bansal Steel', mobile: '9876543232', email: 'manish@bansalsteel.com', status: 'INACTIVE', followUp: '2026-08-07' },
  { name: 'Ayesha Khan', business: 'Khan Cosmetics', mobile: '9876543233', email: 'ayesha@khancosmetics.com', status: 'ACTIVE', followUp: '2026-08-01' },
  { name: 'Gaurav Kapoor', business: 'Kapoor Opticals', mobile: '9876543234', email: 'gaurav@kapooropticals.com', status: 'LEAD', followUp: '2026-07-28' },
  { name: 'Bhavna Desai', business: 'Desai Foods', mobile: '9876543235', email: 'bhavna@desaifoods.com', status: 'ACTIVE', followUp: '2026-07-26' },
  { name: 'Rakesh Nair', business: 'Nair Agencies', mobile: '9876543236', email: 'rakesh@nairagencies.com', status: 'ACTIVE', followUp: '2026-08-03' },
  { name: 'Meera Iyer', business: 'Iyer Books', mobile: '9876543237', email: 'meera@iyerbooks.com', status: 'LEAD', followUp: '2026-07-29' },
  { name: 'Harsh Vora', business: 'Vora Plastics', mobile: '9876543238', email: 'harsh@voraplastics.com', status: 'ACTIVE', followUp: '2026-08-05' },
  { name: 'Sonia Arvind', business: 'Arvind Packaging', mobile: '9876543239', email: 'sonia@arvindpackaging.com', status: 'ACTIVE', followUp: '2026-07-30' },
];

const seedCustomers = async () => {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@erp.com' } });
  if (!admin) {
    console.error('Admin user not found. Make sure bootstrap users have run first.');
    process.exit(1);
  }

  for (const c of CUSTOMERS) {
    const existing = await prisma.customer.findUnique({ where: { mobile: c.mobile } });
    if (existing) {
      console.log(`Skipped (already exists): ${c.name}`);
      continue;
    }

    await prisma.customer.create({
      data: {
        customerName: c.name,
        businessName: c.business,
        mobile: c.mobile,
        email: c.email,
        customerType: 'WHOLESALE',
        status: c.status as any,
        address: 'Not Provided',
        followUpDate: new Date(c.followUp),
        createdById: admin.id,
      },
    });
    console.log(`Created: ${c.name}`);
  }

  console.log('Customer seeding complete.');
  process.exit(0);
};

seedCustomers().catch((err) => {
  console.error(err);
  process.exit(1);
});