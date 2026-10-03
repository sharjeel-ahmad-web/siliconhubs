import mammoth from 'mammoth';

export interface ATSJobContext {
  title?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
}

export interface ATSCheck {
  label: string;
  status: 'good' | 'warning';
  detail: string;
}

export interface ATSReview {
  score: number;
  wordCount: number;
  jobTitle?: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  checks: ATSCheck[];
  reviewedAt: string;
}

const STOP_WORDS = new Set(
  'about above after again against all also an and any are as at be because been before being between both but by can could did do does for from further had has have he her here hers him his how i if in into is it its may me more most my no not of on once only or other our out over same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who will with would you your'.split(
    ' '
  )
);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9+#]+/g, ' ')
    .trim();

export async function extractResumeText(
  buffer: Buffer,
  extension: string
): Promise<string> {
  if (extension === 'pdf') {
    const pdfParse =
      require('pdf-parse/lib/pdf-parse.js') as typeof import('pdf-parse');
    return (await pdfParse(buffer)).text;
  }

  if (extension === 'docx') {
    return (await mammoth.extractRawText({ buffer })).value;
  }

  if (extension === 'doc') {
    const WordExtractor = require('word-extractor') as new () => {
      extract: (input: Buffer) => Promise<{ getBody: () => string }>;
    };
    return (await new WordExtractor().extract(buffer)).getBody();
  }

  throw new Error('This resume file type cannot be analyzed.');
}

export function createATSReview(
  resumeText: string,
  job?: ATSJobContext | null
): ATSReview {
  const normalizedText = normalize(resumeText);
  const words = normalizedText.match(/[a-z0-9+#]+/g) || [];
  const resumeTerms = new Set(words);
  const wordCount = words.length;
  const sectionGroups = [
    /\b(experience|employment|work history|professional history)\b/i.test(
      resumeText
    ),
    /\b(education|academic|qualification)\b/i.test(resumeText),
    /\b(skills|technologies|competencies)\b/i.test(resumeText),
    /\b(summary|profile|objective)\b/i.test(resumeText),
  ];
  const sectionsFound = sectionGroups.filter(Boolean).length;
  const hasEmail = /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(resumeText);
  const hasPhone = /(?:\+?\d[\d\s().-]{6,}\d)/.test(resumeText);
  const formatPoints = wordCount >= 100 ? 25 : wordCount >= 50 ? 15 : 0;
  const sectionPoints = Math.round((sectionsFound / 4) * 20);
  const contactPoints = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);

  const source = [
    job?.title,
    job?.description?.replace(/<[^>]*>/g, ' '),
    job?.responsibilities?.replace(/<[^>]*>/g, ' '),
    job?.requirements?.replace(/<[^>]*>/g, ' '),
    ...(job?.skills || []),
  ]
    .filter(Boolean)
    .join(' ');
  const sourceWords = normalize(source).match(/[a-z0-9+#]+/g) || [];
  const frequencies = new Map<string, number>();
  for (const word of sourceWords) {
    if (word.length >= 3 && !STOP_WORDS.has(word)) {
      frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }
  }

  const skillKeywords = (job?.skills || [])
    .flatMap((skill) => normalize(skill).split(' '))
    .filter(
      (word) =>
        (word.length >= 3 || /^[a-z]#$/i.test(word)) && !STOP_WORDS.has(word)
    );
  const descriptionKeywords = Array.from(frequencies.entries())
    .sort((first, second) => second[1] - first[1])
    .map(([word]) => word);
  const keywords = Array.from(
    new Set([...skillKeywords, ...descriptionKeywords])
  ).slice(0, 16);
  const matchedKeywords = keywords.filter((word) => resumeTerms.has(word));
  const missingKeywords = keywords.filter((word) => !resumeTerms.has(word));
  const hasJobContext = Boolean(job && keywords.length);
  const keywordPoints = hasJobContext
    ? Math.round((matchedKeywords.length / keywords.length) * 45)
    : 0;
  const score = hasJobContext
    ? formatPoints + sectionPoints + contactPoints + keywordPoints
    : Math.round(
        (formatPoints / 25) * 40 +
          (sectionPoints / 20) * 40 +
          (contactPoints / 10) * 20
      );

  const checks: ATSCheck[] = [
    {
      label: 'Readable text',
      status: wordCount >= 50 ? 'good' : 'warning',
      detail:
        wordCount >= 50
          ? `${wordCount} words extracted from the resume.`
          : 'Very little text was extracted. The file may be scanned or image-only.',
    },
    {
      label: 'Common sections',
      status: sectionsFound >= 3 ? 'good' : 'warning',
      detail: `${sectionsFound} of 4 common sections detected: experience, education, skills, and summary.`,
    },
    {
      label: 'Contact details',
      status: hasEmail && hasPhone ? 'good' : 'warning',
      detail: `Email ${hasEmail ? 'found' : 'not found'}; phone ${hasPhone ? 'found' : 'not found'}.`,
    },
  ];

  if (hasJobContext) {
    checks.push({
      label: 'Role keywords',
      status:
        matchedKeywords.length >= keywords.length / 2 ? 'good' : 'warning',
      detail: `${matchedKeywords.length} of ${keywords.length} job-description keywords found.`,
    });
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    wordCount,
    jobTitle: job?.title,
    matchedKeywords,
    missingKeywords,
    checks,
    reviewedAt: new Date().toISOString(),
  };
}
