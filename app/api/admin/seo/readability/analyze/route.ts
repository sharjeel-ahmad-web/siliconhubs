import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Simulated content data for pages
const pageContent: Record<string, any> = {
  '/': {
    title: 'Homepage',
    wordCount: 850,
    sentenceCount: 45,
    paragraphCount: 12,
    avgSentenceLength: 18.9,
    avgWordLength: 5.2,
  },
  '/about': {
    title: 'About',
    wordCount: 620,
    sentenceCount: 35,
    paragraphCount: 8,
    avgSentenceLength: 17.7,
    avgWordLength: 5.0,
  },
  '/services': {
    title: 'Services',
    wordCount: 780,
    sentenceCount: 42,
    paragraphCount: 10,
    avgSentenceLength: 18.6,
    avgWordLength: 5.4,
  },
  '/portfolio': {
    title: 'Portfolio',
    wordCount: 450,
    sentenceCount: 25,
    paragraphCount: 6,
    avgSentenceLength: 18.0,
    avgWordLength: 4.8,
  },
  '/contact': {
    title: 'Contact',
    wordCount: 280,
    sentenceCount: 18,
    paragraphCount: 5,
    avgSentenceLength: 15.6,
    avgWordLength: 4.5,
  },
  '/blog': {
    title: 'Blog',
    wordCount: 520,
    sentenceCount: 30,
    paragraphCount: 7,
    avgSentenceLength: 17.3,
    avgWordLength: 5.1,
  },
};

function calculateFleschScore(
  avgSentenceLength: number,
  avgWordLength: number
): number {
  // Flesch Reading Ease formula approximation
  // 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  // Using avgWordLength as proxy for syllables
  const syllablesPerWord = avgWordLength / 2.5;
  const score = 206.835 - 1.015 * avgSentenceLength - 84.6 * syllablesPerWord;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getFleschGrade(score: number): string {
  if (score >= 90) return '5th grade';
  if (score >= 80) return '6th grade';
  if (score >= 70) return '7th grade';
  if (score >= 60) return '8th grade';
  if (score >= 50) return '9th grade';
  if (score >= 40) return '10th grade';
  if (score >= 30) return '11th grade';
  if (score >= 20) return '12th grade';
  if (score >= 10) return 'College';
  return 'College graduate';
}

function analyzeReadability(page: string, data: any) {
  const fleschScore = calculateFleschScore(
    data.avgSentenceLength,
    data.avgWordLength
  );
  const fleschGrade = getFleschGrade(fleschScore);
  const readingTime = Math.ceil(data.wordCount / 200); // 200 words per minute

  const issues: { type: 'warning' | 'error'; message: string }[] = [];

  if (data.avgSentenceLength > 20) {
    issues.push({
      type: 'warning',
      message: 'Sentences are too long on average. Try to keep under 20 words.',
    });
  }

  if (fleschScore < 50) {
    issues.push({
      type: 'warning',
      message: 'Content may be difficult to read. Consider simplifying.',
    });
  }

  if (data.wordCount < 300) {
    issues.push({
      type: 'warning',
      message: 'Content is thin. Consider adding more valuable content.',
    });
  }

  if (data.paragraphCount < 3) {
    issues.push({
      type: 'warning',
      message: 'Few paragraphs. Break up content for better readability.',
    });
  }

  return {
    page,
    title: data.title,
    fleschScore,
    fleschGrade,
    avgSentenceLength: data.avgSentenceLength,
    avgWordLength: data.avgWordLength,
    wordCount: data.wordCount,
    sentenceCount: data.sentenceCount,
    paragraphCount: data.paragraphCount,
    readingTime,
    issues,
  };
}

// POST - Analyze readability
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const results = Object.entries(pageContent).map(([page, data]) =>
      analyzeReadability(page, data)
    );

    // Save results
    await db.collection('seoReadability').deleteMany({});
    await db.collection('seoReadability').insertMany(results);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error analyzing readability:', error);
    return NextResponse.json(
      { error: 'Failed to analyze readability' },
      { status: 500 }
    );
  }
}
