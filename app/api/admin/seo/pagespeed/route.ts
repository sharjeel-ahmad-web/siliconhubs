import { NextRequest, NextResponse } from 'next/server';

const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';

// POST - Run PageSpeed analysis using real Google API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, device } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Call Google PageSpeed Insights API
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${PAGESPEED_API_KEY}&strategy=${device || 'mobile'}&category=performance`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        {
          error:
            'Google API returned an invalid response. The URL may not be accessible.',
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('PageSpeed API error:', data);
      const errorMessage = data.error?.message || 'Failed to analyze page';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // Extract and format the results
    const lighthouseResult = data.lighthouseResult;
    if (!lighthouseResult) {
      return NextResponse.json(
        {
          error:
            'No lighthouse results returned. The page may not be accessible.',
        },
        { status: 500 }
      );
    }

    const categories = lighthouseResult.categories || {};
    const audits = lighthouseResult.audits || {};

    // Get performance score (0-100)
    const score = Math.round((categories.performance?.score || 0) * 100);

    // Extract Core Web Vitals metrics
    const getMetricScore = (
      value: number,
      thresholds: { good: number; poor: number }
    ): 'good' | 'needs-improvement' | 'poor' => {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.poor) return 'needs-improvement';
      return 'poor';
    };

    const fcpValue = audits['first-contentful-paint']?.numericValue || 0;
    const lcpValue = audits['largest-contentful-paint']?.numericValue || 0;
    const clsValue = audits['cumulative-layout-shift']?.numericValue || 0;
    const fidValue = audits['max-potential-fid']?.numericValue || 0;
    const ttfbValue = audits['server-response-time']?.numericValue || 0;
    const siValue = audits['speed-index']?.numericValue || 0;

    const metrics = {
      fcp: {
        value: Math.round(fcpValue),
        score: getMetricScore(fcpValue, { good: 1800, poor: 3000 }),
      },
      lcp: {
        value: Math.round(lcpValue),
        score: getMetricScore(lcpValue, { good: 2500, poor: 4000 }),
      },
      cls: {
        value: clsValue,
        score: getMetricScore(clsValue, { good: 0.1, poor: 0.25 }),
      },
      fid: {
        value: Math.round(fidValue),
        score: getMetricScore(fidValue, { good: 100, poor: 300 }),
      },
      ttfb: {
        value: Math.round(ttfbValue),
        score: getMetricScore(ttfbValue, { good: 800, poor: 1800 }),
      },
      si: {
        value: Math.round(siValue),
        score: getMetricScore(siValue, { good: 3400, poor: 5800 }),
      },
    };

    // Extract opportunities
    const opportunities: { title: string; savings: string }[] = [];
    const opportunityAudits = [
      'render-blocking-resources',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'offscreen-images',
      'unminified-css',
      'unminified-javascript',
    ];

    for (const auditId of opportunityAudits) {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        const savings = audit.numericValue
          ? `Save ${(audit.numericValue / 1000).toFixed(1)}s`
          : audit.displayValue || '';
        if (savings) {
          opportunities.push({ title: audit.title, savings });
        }
      }
    }

    // Extract diagnostics
    const diagnostics: { title: string; description: string }[] = [];
    const diagnosticAudits = [
      'dom-size',
      'font-display',
      'uses-long-cache-ttl',
      'total-byte-weight',
      'mainthread-work-breakdown',
    ];

    for (const auditId of diagnosticAudits) {
      const audit = audits[auditId];
      if (audit && audit.score !== null && audit.score < 1) {
        diagnostics.push({
          title: audit.title,
          description: audit.displayValue || '',
        });
      }
    }

    const result = {
      url,
      device,
      score,
      metrics,
      opportunities: opportunities.slice(0, 5),
      diagnostics: diagnostics.slice(0, 5),
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running PageSpeed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run PageSpeed analysis' },
      { status: 500 }
    );
  }
}
