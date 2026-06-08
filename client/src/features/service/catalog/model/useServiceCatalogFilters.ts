import { useDeferredValue, useState } from "react";
import type { ServiceDto } from "@shared/contracts/services";

const ALL_CATEGORIES_VALUE = "all";

const normalizeText = (value: string) => value.trim().toLowerCase();

export const useServiceCatalogFilters = (services: ServiceDto[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES_VALUE);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedSearchQuery = normalizeText(deferredSearchQuery);

  const categories = Array.from(new Set(services.map((service) => service.category))).sort(
    (firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory, "ru"),
  );

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      activeCategory === ALL_CATEGORIES_VALUE || service.category === activeCategory;

    if (!matchesCategory) {
      return false;
    }

    if (normalizedSearchQuery.length === 0) {
      return true;
    }

    return [service.title, service.category, service.summary].some((fieldValue) =>
      fieldValue.toLowerCase().includes(normalizedSearchQuery),
    );
  });

  const hasActiveFilters =
    normalizeText(searchQuery).length > 0 || activeCategory !== ALL_CATEGORIES_VALUE;

  const resetFilters = () => {
    setSearchQuery("");
    setActiveCategory(ALL_CATEGORIES_VALUE);
  };

  return {
    activeCategory,
    categories,
    filteredServices,
    hasActiveFilters,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
    resetFilters,
  };
};

export const serviceCatalogFilterValues = {
  allCategories: ALL_CATEGORIES_VALUE,
} as const;
