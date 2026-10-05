export const LETTER_CATALOG = [
  { name: 'Offer Letter', category: 'Hiring' },
  { name: 'Appointment Letter', category: 'Hiring' },
  { name: 'Employment Contract', category: 'Hiring' },
  { name: 'Internship Offer Letter', category: 'Hiring' },
  { name: 'Internship Agreement', category: 'Hiring' },
  { name: 'Joining Letter', category: 'Hiring' },
  { name: 'Probation Confirmation Letter', category: 'Employment' },
  { name: 'Employment Verification Letter', category: 'Employment' },
  { name: 'Employment Certificate', category: 'Employment' },
  { name: 'Experience Letter', category: 'Employment' },
  { name: 'Salary Certificate', category: 'Employment' },
  { name: 'Promotion Letter', category: 'Employment' },
  { name: 'Salary Increment Letter', category: 'Employment' },
  { name: 'Designation Change Letter', category: 'Employment' },
  { name: 'Department Transfer Letter', category: 'Employment' },
  { name: 'Performance Appreciation Letter', category: 'Performance' },
  { name: 'Performance Warning Letter', category: 'Performance' },
  { name: 'Warning Letter', category: 'Performance' },
  { name: 'Show Cause Notice', category: 'Performance' },
  { name: 'Performance Improvement Plan', category: 'Performance' },
  { name: 'Leave Approval Letter', category: 'Leave' },
  { name: 'Leave Rejection Letter', category: 'Leave' },
  { name: 'Extended Leave Approval', category: 'Leave' },
  { name: 'Unauthorized Absence Notice', category: 'Leave' },
  { name: 'Attendance Warning', category: 'Leave' },
  { name: 'Resignation Acceptance', category: 'Exit' },
  { name: 'Notice Period Letter', category: 'Exit' },
  { name: 'Notice Period Waiver', category: 'Exit' },
  { name: 'Early Release Letter', category: 'Exit' },
  { name: 'Termination Letter', category: 'Exit' },
  { name: 'Contract Termination Letter', category: 'Exit' },
  { name: 'Relieving Letter', category: 'Exit' },
  { name: 'No Dues Certificate', category: 'Exit' },
  { name: 'Full & Final Settlement Letter', category: 'Exit' },
  { name: 'Exit Clearance Letter', category: 'Exit' },
  { name: 'Internship Completion Certificate', category: 'Internship' },
  { name: 'Internship Experience Letter', category: 'Internship' },
  { name: 'Internship Extension Letter', category: 'Internship' },
  { name: 'Internship Evaluation Letter', category: 'Internship' },
  { name: 'Internship Termination Letter', category: 'Internship' },
] as const;

export type LetterType = (typeof LETTER_CATALOG)[number]['name'];
export type LetterStatus =
  | 'Draft'
  | 'Generated'
  | 'Issued'
  | 'Cancelled'
  | 'Archived';

export interface HREmployeeInput {
  employeeId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  employmentType: string;
  joiningDate: string;
  salary: string;
  phone: string;
  address: string;
  managerName: string;
  managerDesignation: string;
  active: boolean;
}

export interface HREmployee extends HREmployeeInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface HRLetterTemplateInput {
  name: string;
  letterType: string;
  category: string;
  subject: string;
  body: string;
  active: boolean;
  isDefault: boolean;
}

export interface HRLetterTemplate extends HRLetterTemplateInput {
  _id: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface HRLetter {
  _id: string;
  letterNumber: string;
  letterType: string;
  status: LetterStatus;
  verificationToken?: string;
  issuedAt?: string;
  employeeId: string;
  employeeSnapshot: HREmployeeInput;
  templateSnapshot: Pick<
    HRLetterTemplateInput,
    'name' | 'letterType' | 'subject' | 'body'
  >;
  companySnapshot: CompanyDetails;
  variables: Record<string, string>;
  renderedSubject: string;
  renderedBody: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyDetails {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatureImage: string;
}

export const DEFAULT_COMPANY: CompanyDetails = {
  name: 'SiliconHubs',
  tagline: 'Build. Automate. Scale.',
  email: 'siliconhubs.hq@gmail.com',
  phone: '+923174662728',
  website: 'siliconhubs.com',
  address: '',
  signatoryName: 'Sharjeel Ahmad Khan',
  signatoryDesignation: 'Chief Executive Officer',
  signatureImage: '',
};

export const TEMPLATE_VARIABLES = [
  'employee_name',
  'designation',
  'department',
  'joining_date',
  'employment_type',
  'salary',
  'email',
  'phone',
  'manager_name',
  'manager_designation',
  'company_name',
  'company_email',
  'company_phone',
  'company_website',
  'company_address',
  'signatory_name',
  'signatory_designation',
  'letter_date',
  'effective_date',
  'last_working_date',
  'notice_period',
  'employee_address',
  'employment_duration',
] as const;

export function createDefaultTemplate(
  letterType: (typeof LETTER_CATALOG)[number]
): HRLetterTemplateInput {
  const hiring = letterType.category === 'Hiring';
  const exit = letterType.category === 'Exit';
  const body = hiring
    ? `Dear {{employee_name}},\n\nWe are pleased to offer you the position of {{designation}} in the {{department}} department at {{company_name}}. Your employment type will be {{employment_type}}, with an anticipated start date of {{effective_date}}.\n\nPlease contact us at {{company_email}} if you have any questions. We look forward to welcoming you to the team.\n\nSincerely,\n{{signatory_name}}\n{{signatory_designation}}\n{{company_name}}`
    : exit
      ? `To whom it may concern,\n\nThis letter confirms that {{employee_name}} was employed by {{company_name}} as {{designation}} in the {{department}} department from {{joining_date}} through {{last_working_date}}.\n\nWe thank {{employee_name}} for their contributions and wish them success in their future endeavors.\n\nSincerely,\n{{signatory_name}}\n{{signatory_designation}}\n{{company_name}}`
      : `Dear {{employee_name}},\n\nThis letter is issued to {{employee_name}}, who is employed by {{company_name}} as {{designation}} in the {{department}} department. Their employment began on {{joining_date}}.\n\nFor additional information, please contact {{company_email}}.\n\nSincerely,\n{{signatory_name}}\n{{signatory_designation}}\n{{company_name}}`;

  return {
    name: letterType.name,
    letterType: letterType.name,
    category: letterType.category,
    subject: letterType.name,
    body,
    active: true,
    isDefault: true,
  };
}

export function renderTemplate(
  content: string,
  variables: Record<string, string>
): string {
  return content.replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (match, key: string) =>
      Object.prototype.hasOwnProperty.call(variables, key)
        ? variables[key]
        : match
  );
}

export function buildEmployeeVariables(
  employee: HREmployeeInput,
  overrides: Record<string, unknown> = {},
  letterDate = new Date(),
  company: CompanyDetails = DEFAULT_COMPANY
): Record<string, string> {
  const duration = employee.joiningDate
    ? Math.max(
        0,
        Math.floor(
          (letterDate.getTime() - new Date(employee.joiningDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;
  const days = duration % 30;
  const months = Math.floor(duration / 30);
  const employmentDuration = `${Math.floor(months / 12)} years, ${months % 12} months, ${days} days`;
  const variables: Record<string, string> = {
    employee_name: employee.name,
    designation: employee.designation,
    department: employee.department,
    joining_date: employee.joiningDate,
    employment_type: employee.employmentType,
    salary: employee.salary,
    email: employee.email,
    phone: employee.phone,
    manager_name: employee.managerName,
    manager_designation: employee.managerDesignation,
    company_name: company.name,
    company_email: company.email,
    company_phone: company.phone,
    company_website: company.website,
    company_address: company.address,
    signatory_name: company.signatoryName,
    signatory_designation: company.signatoryDesignation,
    letter_date: letterDate.toISOString().slice(0, 10),
    effective_date: letterDate.toISOString().slice(0, 10),
    last_working_date: '',
    notice_period: '',
    employee_address: employee.address,
    employment_duration: employmentDuration,
  };

  for (const key of TEMPLATE_VARIABLES) {
    const override = overrides[key];
    if (typeof override === 'string') variables[key] = override.slice(0, 500);
  }

  return variables;
}
