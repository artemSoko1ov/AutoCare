import type { ChangeEvent } from "react";
import clsx from "clsx";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import styles from "./ServicesCatalogFilters.module.scss";

type ServicesCatalogFiltersProps = {
  activeCategory: string;
  categories: string[];
  hasActiveFilters: boolean;
  resultsCount: number;
  searchQuery: string;
  totalCount: number;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
  onSearchQueryChange: (value: string) => void;
};

const ServicesCatalogFilters = ({
  activeCategory,
  categories,
  hasActiveFilters,
  onCategoryChange,
  onReset,
  onSearchQueryChange,
  resultsCount,
  searchQuery,
  totalCount,
}: ServicesCatalogFiltersProps) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(event.target.value);
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.filters)}>
      <div className={styles.header}>
        <div className={styles.headerBody}>
          <h2 className={styles.title}>Подбор услуги</h2>
          <p className={styles.description}>
            Можно быстро отфильтровать каталог по категории или найти услугу по названию и описанию.
          </p>
        </div>

        <div className={styles.results}>
          Найдено {resultsCount} из {totalCount}
        </div>
      </div>

      <div className={styles.searchRow}>
        <Input
          label="Поиск по каталогу"
          leftIcon={<Icon name="wrench" />}
          onChange={handleSearchChange}
          placeholder="Например, диагностика, консультация или подбор"
          value={searchQuery}
        />

        {hasActiveFilters ? (
          <Button
            className={styles.resetButton}
            leftIcon={<Icon name="x-mark" />}
            onClick={onReset}
            size="md"
            variant="ghost"
          >
            Сбросить
          </Button>
        ) : null}
      </div>

      <div className={styles.categories}>
        <button
          className={clsx(styles.categoryButton, {
            [styles["categoryButton--active"]]: activeCategory === "all",
          })}
          onClick={() => {
            onCategoryChange("all");
          }}
          type="button"
        >
          Все категории
        </button>

        {categories.map((category) => (
          <button
            className={clsx(styles.categoryButton, {
              [styles["categoryButton--active"]]: activeCategory === category,
            })}
            key={category}
            onClick={() => {
              onCategoryChange(category);
            }}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </article>
  );
};

export default ServicesCatalogFilters;
