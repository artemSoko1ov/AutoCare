import { z } from 'zod';

export const serviceStatusValues = ['active', 'draft', 'hidden'] as const;

export const serviceStatusSchema = z.enum(serviceStatusValues);

export const serviceDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  summary: z.string(),
  priceFrom: z.number().int(),
  durationLabel: z.string(),
  status: serviceStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getServicesResponseSchema = z.array(serviceDtoSchema);
export const getServiceResponseSchema = serviceDtoSchema;

export type ServiceStatus = z.infer<typeof serviceStatusSchema>;
export type ServiceDto = z.infer<typeof serviceDtoSchema>;
export type GetServicesResponse = z.infer<typeof getServicesResponseSchema>;
export type GetServiceResponse = z.infer<typeof getServiceResponseSchema>;
