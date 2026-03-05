import crypto from 'crypto';

export function hashPhotos(photoUrls: string[]): string {
  return crypto
    .createHash('sha256')
    .update(photoUrls.join('|'))
    .digest('hex');
}