import {
  buildEmployeeVariables,
  DEFAULT_COMPANY,
  renderTemplate,
  type HREmployeeInput,
} from '@/lib/hr-letters/types';
import {
  formatHRLetterText,
  removeEmployeeIdFromLetter,
} from '@/lib/hr-letters/letter-format';

const employee: HREmployeeInput = {
  employeeId: 'SH-001',
  name: 'Amina Khan',
  email: 'amina@example.com',
  designation: 'Product Designer',
  department: 'Design',
  employmentType: 'Full Time',
  joiningDate: '2024-01-01',
  salary: 'PKR 100,000',
  phone: '+923000000000',
  address: '',
  managerName: 'Ali Ahmed',
  managerDesignation: 'Design Lead',
  active: true,
};

describe('HR letter template variables', () => {
  it('uses the requested CEO as the default letter signatory', () => {
    expect(DEFAULT_COMPANY.signatoryName).toBe('Sharjeel Ahmad Khan');
    expect(DEFAULT_COMPANY.signatoryDesignation).toBe(
      'Chief Executive Officer'
    );
  });

  it('renders employee and company variables from a private employee snapshot', () => {
    const variables = buildEmployeeVariables(
      employee,
      { effective_date: '2026-10-05' },
      new Date('2026-10-05T00:00:00.000Z')
    );

    expect(
      renderTemplate(
        '{{employee_name}} joins {{company_name}} on {{effective_date}}.',
        variables
      )
    ).toBe('Amina Khan joins SiliconHubs on 2026-10-05.');
  });

  it('leaves unsupported tokens intact so API validation can reject them', () => {
    expect(renderTemplate('Hello {{unknown_field}}', {})).toBe(
      'Hello {{unknown_field}}'
    );
  });

  it('removes employee ID references and highlights key letter details', () => {
    const body =
      'Dear Amina Khan (Employee ID: SH-001), your Full Time role starts on 2026-10-05.';

    expect(removeEmployeeIdFromLetter(body)).toBe(
      'Dear Amina Khan, your Full Time role starts on 2026-10-05.'
    );
    expect(
      formatHRLetterText(body, {
        employeeName: 'Amina Khan',
        employmentType: 'Full Time',
        issuedDate: '2026-10-05',
      })
        .filter((segment) => segment.style !== 'normal')
        .map((segment) => [segment.text, segment.style])
    ).toEqual([
      ['Amina Khan', 'employeeName'],
      ['Full Time', 'employmentType'],
      ['2026-10-05', 'issuedDate'],
    ]);
  });
});
