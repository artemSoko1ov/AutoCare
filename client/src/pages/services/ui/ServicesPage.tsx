import clsx from "clsx";
import { ServicesCatalogFilters, useServiceCatalogFilters } from "@/features/service/catalog";
import { useServicesQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import ServicesCatalog from "@/widgets/services-catalog";
import styles from "./ServicesPage.module.scss";

const ServicesPage = () => {
  const { data = [], isError, isLoading, refetch } = useServicesQuery();
  const {
    activeCategory,
    categories,
    filteredServices,
    hasActiveFilters,
    resetFilters,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
  } = useServiceCatalogFilters(data);

  return (
    <Section
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description="Подберите подходящую услугу для диагностики, сопровождения сделки или регулярного обслуживания автомобиля."
      title="Услуги"
      titleAs="h1"
      titleSize="h1"
    >
      {isLoading ? (
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <div className={styles.stateHeader}>
            <span className={styles.stateIcon}>
              <Icon name="wrench" />
            </span>
            <h2 className={styles.stateTitle}>Загружаем каталог услуг</h2>
          </div>

          <p className={styles.stateDescription}>
            Получаем актуальные предложения сервиса, чтобы показать только активные позиции.
          </p>
        </article>
      ) : null}

      {!isLoading && isError ? (
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <div className={styles.stateHeader}>
            <span className={styles.stateIcon}>
              <Icon name="support" />
            </span>
            <h2 className={styles.stateTitle}>Не удалось загрузить услуги</h2>
          </div>

          <p className={styles.stateDescription}>
            Каталог временно недоступен. Можно повторить запрос и снова получить данные с сервера.
          </p>

          <div className={styles.stateActions}>
            <Button
              leftIcon={<Icon name="wrench" />}
              onClick={() => {
                void refetch();
              }}
              size="sm"
              variant="secondary"
            >
              Повторить загрузку
            </Button>
          </div>
        </article>
      ) : null}

      {!isLoading && !isError && data.length > 0 ? (
        <>
          <ServicesCatalogFilters
            activeCategory={activeCategory}
            categories={categories}
            hasActiveFilters={hasActiveFilters}
            onCategoryChange={setActiveCategory}
            onReset={resetFilters}
            onSearchQueryChange={setSearchQuery}
            resultsCount={filteredServices.length}
            searchQuery={searchQuery}
            totalCount={data.length}
          />

          {filteredServices.length > 0 ? (
            <ServicesCatalog services={filteredServices} />
          ) : (
            <article className={clsx("surface", "surface--glass", styles.stateCard)}>
              <div className={styles.stateHeader}>
                <span className={styles.stateIcon}>
                  <Icon name="support" />
                </span>
                <h2 className={styles.stateTitle}>По фильтрам ничего не найдено</h2>
              </div>

              <p className={styles.stateDescription}>
                Попробуйте снять часть ограничений или сбросить поиск, чтобы снова увидеть весь
                каталог.
              </p>

              <Empty
                action={
                  <Button
                    leftIcon={<Icon name="x-mark" />}
                    onClick={resetFilters}
                    size="sm"
                    variant="secondary"
                  >
                    Сбросить фильтры
                  </Button>
                }
                compact
                description="Сейчас ни одна активная услуга не подходит под выбранную категорию или поисковый запрос."
                icon="wrench"
                title="Нет подходящих услуг"
              />
            </article>
          )}
        </>
      ) : null}

      {!isLoading && !isError && data.length === 0 ? <ServicesCatalog services={data} /> : null}
    </Section>
  );
};

export default ServicesPage;
