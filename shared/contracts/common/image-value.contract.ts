export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const DATA_IMAGE_URL_PATTERN =
  /^data:image\/[a-zA-Z0-9.+-]+;base64,[a-zA-Z0-9+/=\s]+$/;

export const isSupportedImageValue = (value: string) => {
  if (DATA_IMAGE_URL_PATTERN.test(value)) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

const getDataImagePayload = (value: string) => {
  if (!value.startsWith('data:image/')) {
    return null;
  }

  const separatorIndex = value.indexOf(',');

  if (separatorIndex < 0) {
    return null;
  }

  return value.slice(separatorIndex + 1).replace(/\s+/g, '');
};

export const isImageValueWithinSizeLimit = (
  value: string,
  maxSizeBytes = MAX_IMAGE_FILE_SIZE_BYTES,
) => {
  const payload = getDataImagePayload(value);

  if (payload === null) {
    return true;
  }

  if (payload.length === 0 || payload.length % 4 !== 0) {
    return false;
  }

  const paddingLength = payload.endsWith('==')
    ? 2
    : payload.endsWith('=')
      ? 1
      : 0;
  const decodedSizeBytes = Math.floor((payload.length * 3) / 4) - paddingLength;

  return decodedSizeBytes <= maxSizeBytes;
};
