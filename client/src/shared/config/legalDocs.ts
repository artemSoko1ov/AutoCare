const buildPublicDocumentUrl = (fileName: string) => encodeURI(`/docs/${fileName}`);

export const LEGAL_DOCS = {
  consent: {
    label: "Согласие на обработку персональных данных",
    href: buildPublicDocumentUrl("Согласие на обработку персональных данных.pdf"),
  },
  privacyPolicy: {
    label: "Политика конфиденциальности",
    href: buildPublicDocumentUrl("Политика конфиденциальности.pdf"),
  },
  personalDataPolicy: {
    label: "Политика обработки персональных данных",
    href: buildPublicDocumentUrl("Политика обработки персональных данных.pdf"),
  },
} as const;
