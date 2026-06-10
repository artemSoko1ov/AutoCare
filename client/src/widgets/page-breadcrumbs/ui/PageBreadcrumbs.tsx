import { useMemo } from "react";
import clsx from "clsx";
import { Link, matchPath, useLocation, useSearchParams } from "react-router-dom";
import { useServiceQuery } from "@/entities/service";
import { createPageBreadcrumbs } from "../model/createPageBreadcrumbs";
import styles from "./PageBreadcrumbs.module.scss";

type PageBreadcrumbsProps = {
  className?: string;
};

const PageBreadcrumbs = ({ className }: PageBreadcrumbsProps) => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const serviceDetailMatch = matchPath("/services/:serviceId", pathname);
  const isRequestCreatePage = Boolean(matchPath("/requests/new", pathname));
  const serviceId =
    serviceDetailMatch?.params.serviceId ||
    (isRequestCreatePage ? (searchParams.get("serviceId") ?? undefined) : undefined);
  const { data: service } = useServiceQuery(serviceId);

  const items = useMemo(() => {
    return createPageBreadcrumbs({
      pathname,
      serviceCategory: service?.category,
      serviceId,
      serviceTitle: service?.title,
    });
  }, [pathname, service?.category, service?.title, serviceId]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Хлебные крошки" className={clsx(styles.breadcrumbs, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className={styles.item} key={`${item.label}-${item.to ?? index}`}>
              {item.to && !isCurrent ? (
                <Link className={styles.link} to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}

              {!isCurrent ? (
                <span aria-hidden="true" className={styles.separator}>
                  &gt;
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default PageBreadcrumbs;
