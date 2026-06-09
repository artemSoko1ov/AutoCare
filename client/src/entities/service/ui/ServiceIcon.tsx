import { useEffect, useState, type CSSProperties } from "react";
import clsx from "clsx";
import styles from "./ServiceIcon.module.scss";

const DEFAULT_SERVICE_ICON_PATH = "/icons/services/wrench.svg";

type ServiceIconProps = {
  className?: string;
  src?: string | null;
};

const normalizeIconPath = (src?: string | null) => {
  const normalizedValue = src?.trim();
  return normalizedValue && normalizedValue.length > 0
    ? normalizedValue
    : DEFAULT_SERVICE_ICON_PATH;
};

const ServiceIcon = ({ className, src }: ServiceIconProps) => {
  const [currentSrc, setCurrentSrc] = useState(() => normalizeIconPath(src));

  useEffect(() => {
    const nextSrc = normalizeIconPath(src);
    const image = new Image();
    let isMounted = true;

    image.onload = () => {
      if (isMounted) {
        setCurrentSrc(nextSrc);
      }
    };

    image.onerror = () => {
      if (isMounted) {
        setCurrentSrc(DEFAULT_SERVICE_ICON_PATH);
      }
    };

    image.src = nextSrc;

    return () => {
      isMounted = false;
    };
  }, [src]);

  const iconStyle = {
    "--service-icon-mask": `url(${currentSrc})`,
  } as CSSProperties;

  return (
    <span aria-hidden="true" className={clsx(styles.icon, className)}>
      <span className={styles.glyph} style={iconStyle} />
    </span>
  );
};

export default ServiceIcon;
