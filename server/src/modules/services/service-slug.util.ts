import { createHash } from 'node:crypto';

const normalizeSlugValue = (value: string) => {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
};

export const createServiceSlug = (title: string, category: string) => {
  const hash = createHash('md5')
    .update(`${normalizeSlugValue(title)}|${normalizeSlugValue(category)}`)
    .digest('hex')
    .slice(0, 16);

  return `service-${hash}`;
};
