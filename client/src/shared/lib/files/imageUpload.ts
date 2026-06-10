export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export type ImageFileValidationError = "invalid-type" | "too-large";

export const getImageFileValidationError = (file: File): ImageFileValidationError | null => {
  if (!file.type.startsWith("image/")) {
    return "invalid-type";
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return "too-large";
  }

  return null;
};

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Не удалось прочитать файл"));
    };

    reader.onerror = () => {
      reject(new Error("Не удалось прочитать файл"));
    };

    reader.readAsDataURL(file);
  });
