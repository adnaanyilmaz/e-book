import type { APIContext } from 'astro';
import { rssUret } from '@/lib/rss';

export const GET = (context: APIContext) => rssUret('tr', context);
