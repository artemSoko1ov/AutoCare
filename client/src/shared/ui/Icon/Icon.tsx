import type { HTMLAttributes, ReactElement, SVGProps } from "react";
import clsx from "clsx";
import bellSvg from "@/shared/assets/icons/bell.svg?raw";
import cameraSvg from "@/shared/assets/icons/photo.svg?raw";
import clockSvg from "@/shared/assets/icons/clock.svg?raw";
import heartSvg from "@/shared/assets/icons/heart.svg?raw";
import inboxSvg from "@/shared/assets/icons/inbox.svg?raw";
import lockSvg from "@/shared/assets/icons/lock-closed.svg?raw";
import logoutSvg from "@/shared/assets/icons/logout.svg?raw";
import mailSvg from "@/shared/assets/icons/envelope.svg?raw";
import mapPinSvg from "@/shared/assets/icons/map-pin.svg?raw";
import pencilSvg from "@/shared/assets/icons/pencil.svg?raw";
import phoneSvg from "@/shared/assets/icons/phone.svg?raw";
import playSvg from "@/shared/assets/icons/play-circle.svg?raw";
import plusSvg from "@/shared/assets/icons/plus.svg?raw";
import questionMarkCircleSvg from "@/shared/assets/icons/question-mark-circle.svg?raw";
import settingsSvg from "@/shared/assets/icons/settings.svg?raw";
import treeDotSvg from "@/shared/assets/icons/tree-dot.svg?raw";
import trashSvg from "@/shared/assets/icons/trash.svg?raw";
import userSvg from "@/shared/assets/icons/user.svg?raw";
import walletSvg from "@/shared/assets/icons/wallet.svg?raw";
import wrenchSvg from "@/shared/assets/icons/wrench.svg?raw";
import xMarkSvg from "@/shared/assets/icons/x-mark.svg?raw";
import styles from "./Icon.module.scss";

export type IconName =
  | "user"
  | "car"
  | "orders"
  | "heart"
  | "star"
  | "play"
  | "shield"
  | "bell"
  | "settings"
  | "logout"
  | "support"
  | "crown"
  | "camera"
  | "mail"
  | "lock"
  | "phone"
  | "map-pin"
  | "briefcase"
  | "check-circle"
  | "clock"
  | "plus"
  | "pencil"
  | "trash"
  | "x-mark"
  | "eye"
  | "eye-slash"
  | "chevron-right"
  | "more"
  | "wallet"
  | "wrench";

type SvgIconProps = SVGProps<SVGSVGElement>;

const normalizeSvgMarkup = (markup: string) =>
  markup
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/\s(?:width|height)="[^"]*"/gi, "")
    .replace(/stroke="(?!none")[^"]*"/gi, 'stroke="currentColor"')
    .replace(/fill="(?!none")[^"]*"/gi, 'fill="currentColor"');

const inlineIcons: Partial<Record<IconName, string>> = {
  user: normalizeSvgMarkup(userSvg),
  orders: normalizeSvgMarkup(inboxSvg),
  heart: normalizeSvgMarkup(heartSvg),
  play: normalizeSvgMarkup(playSvg),
  bell: normalizeSvgMarkup(bellSvg),
  settings: normalizeSvgMarkup(settingsSvg),
  logout: normalizeSvgMarkup(logoutSvg),
  support: normalizeSvgMarkup(questionMarkCircleSvg),
  camera: normalizeSvgMarkup(cameraSvg),
  mail: normalizeSvgMarkup(mailSvg),
  lock: normalizeSvgMarkup(lockSvg),
  phone: normalizeSvgMarkup(phoneSvg),
  "map-pin": normalizeSvgMarkup(mapPinSvg),
  clock: normalizeSvgMarkup(clockSvg),
  plus: normalizeSvgMarkup(plusSvg),
  pencil: normalizeSvgMarkup(pencilSvg),
  trash: normalizeSvgMarkup(trashSvg),
  more: normalizeSvgMarkup(treeDotSvg),
  wallet: normalizeSvgMarkup(walletSvg),
  wrench: normalizeSvgMarkup(wrenchSvg),
  "x-mark": normalizeSvgMarkup(xMarkSvg),
};

const CarSvg = (props: SvgIconProps) => (
  <svg fill="none" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="m5.4341 9h2.566v-1.998c-.797.034-1.529.443-1.975 1.111zm3.566 0h6.565l-1.333-2h-5.232zm9.95 5h.769c.23 0 .429-.156.485-.379l.557-2.225c.033-.133.01-.271-.063-.389-.075-.116-.19-.195-.325-.223l-3.158-.632c-.172-.034-.338-.085-.496-.152h-12.101c-.961.397-1.627 1.301-1.61809011 2.354v1.146c0 .276.22409011.5.50009011.5h.55c.233-1.14 1.242-2 2.45-2 1.207 0 2.217.86 2.45 2h5.1c.233-1.14 1.242-2 2.45-2 1.207 0 2.217.86 2.45 2zm-12.45-1c-.827 0-1.5.673-1.5 1.5s.673 1.5 1.5 1.5 1.5-.673 1.5-1.5-.673-1.5-1.5-1.5zm10 0c-.827 0-1.5.673-1.5 1.5s.673 1.5 1.5 1.5 1.5-.673 1.5-1.5-.673-1.5-1.5-1.5zm0 4c-1.208 0-2.217-.86-2.45-2h-5.1c-.233 1.14-1.243 2-2.45 2-1.208 0-2.217-.86-2.45-2h-.55c-.827 0-1.50005502-.673-1.50005502-1.5v-1.146c-.00794498-1.425.85705502-2.68 2.15805502-3.242l1.035-1.553c.651-.976 1.74-1.559 2.912-1.559h6.395c.167 0 .323.083.416.223l1.54 2.311c.223.334.565.56.954.637l3.16.633c.406.081.751.319.972.669.222.35.289.764.189 1.166l-.557 2.225c-.167.669-.765 1.136-1.455 1.136h-.769c-.233 1.14-1.243 2-2.45 2z"
        fill="currentColor"
      />
    </g>
  </svg>
);

const OrdersSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect height="18" rx="3" width="14" x="5" y="3" />
    <path d="M9 7h6M9 11h6M9 15h4" />
  </svg>
);

const StarSvg = (props: SvgIconProps) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="m12 2.75 2.83 5.74 6.34.92-4.58 4.46 1.08 6.31L12 17.2l-5.67 2.98 1.08-6.31L2.83 9.4l6.34-.92L12 2.75Z" />
  </svg>
);

const ShieldSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" />
    <path d="m9.5 12 1.7 1.7 3.3-3.7" />
  </svg>
);

const SupportSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M4 13v-1a8 8 0 1 1 16 0v1" />
    <path d="M4 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v-6H4Z" />
    <path d="M20 13h-2v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2Z" />
    <path d="M8 19a4 4 0 0 0 4 3h2" />
  </svg>
);

const CrownSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" />
    <path d="M6 19h12" />
  </svg>
);

const BriefcaseSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect height="14" rx="2" width="18" x="3" y="7" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M3 12h18" />
  </svg>
);

const CheckCircleSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.2 2.2 4.8-5.2" />
  </svg>
);

const ChevronRightSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const MoreSvg = (props: SvgIconProps) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="5" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="19" r="1.75" />
  </svg>
);

const EyeSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeSlashSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m3 3 18 18" />
    <path d="M10.6 6.2A10.6 10.6 0 0 1 12 6c6 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3 3.7" />
    <path d="M6.6 6.6A18.4 18.4 0 0 0 2.5 12s3.5 6 9.5 6c1.8 0 3.4-.5 4.8-1.3" />
    <path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" />
  </svg>
);

const fallbackIcons: Partial<Record<IconName, (props: SvgIconProps) => ReactElement>> = {
  car: CarSvg,
  orders: OrdersSvg,
  star: StarSvg,
  shield: ShieldSvg,
  support: SupportSvg,
  crown: CrownSvg,
  briefcase: BriefcaseSvg,
  "check-circle": CheckCircleSvg,
  "chevron-right": ChevronRightSvg,
  more: MoreSvg,
  eye: EyeSvg,
  "eye-slash": EyeSlashSvg,
};

export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  name: IconName;
}

const Icon = ({ className, name, ...props }: IconProps) => {
  const markup = inlineIcons[name];

  if (markup) {
    return (
      <span
        {...props}
        aria-hidden={props["aria-hidden"] ?? true}
        className={clsx(styles.icon, className)}
      >
        <span
          aria-hidden="true"
          className={styles.glyph}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      </span>
    );
  }

  const Component = fallbackIcons[name];

  if (!Component) {
    return null;
  }

  return (
    <span
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      className={clsx(styles.icon, className)}
    >
      <span aria-hidden="true" className={styles.glyph}>
        <Component aria-hidden="true" focusable="false" />
      </span>
    </span>
  );
};

export default Icon;
