import { NextRequest, NextResponse } from 'next/server';

interface SeoIssue {
  type: 'success' | 'warning' | 'error';
  label: string;
  details: string;
}

function extractTag(html: string, pattern: RegExp): string {
  return html.match(pattern)?.[1]?.trim() || '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
    const targetUrl = new URL(rawUrl);

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are supported.' },
        { status: 400 }
      );
    }

    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    let response: Response;

    try {
      response = await fetch(targetUrl, {
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'SiliconHubs-SEO-Tester/1.0' },
      });
    } finally {
      clearTimeout(timeout);
    }

    const html = await response.text();
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractTag(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );
    const h1Matches = html.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi) || [];
    const imageMatches = html.match(/<img\b[^>]*>/gi) || [];
    const imagesWithAlt = imageMatches.filter((image) =>
      /\balt=["'][^"']*["']/i.test(image)
    ).length;
    const internalLinks = (
      html.match(/<a\b[^>]+href=["'][^"']*["']/gi) || []
    ).filter((link) => {
      const href = link.match(/href=["']([^"']*)["']/i)?.[1] || '';
      return href.startsWith('/') || href.includes(targetUrl.hostname);
    }).length;
    const responseTime = Date.now() - startedAt;
    const issues: SeoIssue[] = [];

    if (title.length >= 30 && title.length <= 60)
      issues.push({
        type: 'success',
        label: 'Page title',
        details: `${title.length} characters, within the recommended range.`,
      });
    else if (title)
      issues.push({
        type: 'warning',
        label: 'Page title',
        details: `${title.length} characters. Aim for 30-60 characters.`,
      });
    else
      issues.push({
        type: 'error',
        label: 'Page title',
        details: 'No title tag found.',
      });

    if (description.length >= 120 && description.length <= 160)
      issues.push({
        type: 'success',
        label: 'Meta description',
        details: `${description.length} characters, within the recommended range.`,
      });
    else if (description)
      issues.push({
        type: 'warning',
        label: 'Meta description',
        details: `${description.length} characters. Aim for 120-160 characters.`,
      });
    else
      issues.push({
        type: 'error',
        label: 'Meta description',
        details: 'No meta description found.',
      });

    if (h1Matches.length === 1)
      issues.push({
        type: 'success',
        label: 'H1 heading',
        details: 'Exactly one H1 heading found.',
      });
    else if (h1Matches.length === 0)
      issues.push({
        type: 'error',
        label: 'H1 heading',
        details: 'No H1 heading found.',
      });
    else
      issues.push({
        type: 'warning',
        label: 'H1 heading',
        details: `${h1Matches.length} H1 headings found. Aim for one.`,
      });

    if (imageMatches.length === 0 || imagesWithAlt === imageMatches.length)
      issues.push({
        type: 'success',
        label: 'Image accessibility',
        details: `${imagesWithAlt}/${imageMatches.length} images have alt text.`,
      });
    else
      issues.push({
        type: 'warning',
        label: 'Image accessibility',
        details: `${imageMatches.length - imagesWithAlt} images are missing alt text.`,
      });

    if (targetUrl.protocol === 'https:')
      issues.push({
        type: 'success',
        label: 'HTTPS security',
        details: 'The website uses HTTPS.',
      });
    else
      issues.push({
        type: 'warning',
        label: 'HTTPS security',
        details: 'Use HTTPS to protect visitors and improve trust.',
      });

    if (responseTime < 1000)
      issues.push({
        type: 'success',
        label: 'Response speed',
        details: `Initial response took ${responseTime}ms.`,
      });
    else
      issues.push({
        type: 'warning',
        label: 'Response speed',
        details: `Initial response took ${responseTime}ms.`,
      });

    const score = Math.max(
      0,
      Math.round(
        (issues.filter((issue) => issue.type === 'success').length /
          issues.length) *
          100
      )
    );
    return NextResponse.json({
      url: targetUrl.toString(),
      status: response.status,
      score,
      responseTime,
      title,
      description,
      h1Count: h1Matches.length,
      images: { total: imageMatches.length, withAlt: imagesWithAlt },
      internalLinks,
      issues,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'The website took too long to respond.'
        : 'Unable to fetch this website. Check the URL and make sure it is publicly reachable.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
