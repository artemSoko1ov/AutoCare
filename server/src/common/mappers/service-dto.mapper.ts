import { Prisma } from '@prisma/client';
import type { ServiceDto } from '@shared/contracts/services';

export const serviceDtoSelect = {
  id: true,
  title: true,
  category: true,
  summary: true,
  iconPath: true,
  includedItems: true,
  workflowSteps: true,
  priceFrom: true,
  durationLabel: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ServiceSelect;

export type ServiceDtoSource = Prisma.ServiceGetPayload<{
  select: typeof serviceDtoSelect;
}>;

export const toServiceDto = (service: ServiceDtoSource): ServiceDto => ({
  id: service.id,
  title: service.title,
  category: service.category,
  summary: service.summary,
  iconPath: service.iconPath,
  includedItems: service.includedItems,
  workflowSteps: service.workflowSteps,
  priceFrom: service.priceFrom,
  durationLabel: service.durationLabel,
  status: service.status,
  createdAt: service.createdAt.toISOString(),
  updatedAt: service.updatedAt.toISOString(),
});
