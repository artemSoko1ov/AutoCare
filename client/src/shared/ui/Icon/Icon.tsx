import type { ReactElement, SVGProps } from "react";

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
  | "phone"
  | "map-pin"
  | "briefcase"
  | "check-circle"
  | "clock"
  | "plus"
  | "chevron-right"
  | "more"
  | "wrench";

type SvgIconProps = SVGProps<SVGSVGElement>;

const UserSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M19 21a7 7 0 0 0-14 0" />
    <circle cx="12" cy="8" r="4" />
  </svg>
);

const CarSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M4 13 6.2 7.6A2 2 0 0 1 8.05 6h7.9a2 2 0 0 1 1.85 1.6L20 13" />
    <path d="M3 11.5h18a1 1 0 0 1 1 1V17a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a2 2 0 0 1-2-2v-4.5a1 1 0 0 1 1-1Z" />
    <circle cx="7.5" cy="15.5" r="1.5" />
    <circle cx="16.5" cy="15.5" r="1.5" />
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

const HeartSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m12 20-1.15-1.05C5.4 13.98 2 10.9 2 7.1A4.1 4.1 0 0 1 6.12 3 4.7 4.7 0 0 1 12 6.26 4.7 4.7 0 0 1 17.88 3 4.1 4.1 0 0 1 22 7.1c0 3.8-3.4 6.88-8.85 11.85Z" />
  </svg>
);

const StarSvg = (props: SvgIconProps) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="m12 2.75 2.83 5.74 6.34.92-4.58 4.46 1.08 6.31L12 17.2l-5.67 2.98 1.08-6.31L2.83 9.4l6.34-.92L12 2.75Z" />
  </svg>
);

const PlaySvg = (props: SvgIconProps) => (
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
    <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
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

const BellSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </svg>
);

const SettingsSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="m19.4 15 1.1 1.9-1.8 3.1-2.2-.4a7.8 7.8 0 0 1-1.6.9l-.7 2.1H9.8l-.7-2.1a7.8 7.8 0 0 1-1.6-.9l-2.2.4-1.8-3.1L4.6 15a8.8 8.8 0 0 1 0-2l-1.1-1.9 1.8-3.1 2.2.4c.5-.35 1.03-.65 1.6-.9l.7-2.1h4.4l.7 2.1c.57.25 1.1.55 1.6.9l2.2-.4 1.8 3.1-1.1 1.9a8.8 8.8 0 0 1 0 2Z" />
  </svg>
);

const LogoutSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M15 17l5-5-5-5" />
    <path d="M20 12H9" />
    <path d="M12 19a8 8 0 1 1 0-14" />
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

const CameraSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M4 8h3l1.5-2h7L17 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

const MailSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect height="14" rx="2" width="18" x="3" y="5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const PhoneSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.1 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72l.35 2.57a2 2 0 0 1-.57 1.72l-1.4 1.4a16 16 0 0 0 5.64 5.64l1.4-1.4a2 2 0 0 1 1.72-.57l2.57.35A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const MapPinSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
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

const ClockSvg = (props: SvgIconProps) => (
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
    <path d="M12 7v5l3 2" />
  </svg>
);

const PlusSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
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

const WrenchSvg = (props: SvgIconProps) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M14.5 6.5a4 4 0 0 0 4.99 4.99l-8.2 8.2a2.12 2.12 0 1 1-3-3l8.2-8.2A4 4 0 0 0 14.5 6.5Z" />
    <path d="m16 4 4 4" />
  </svg>
);

const icons = {
  user: UserSvg,
  car: CarSvg,
  orders: OrdersSvg,
  heart: HeartSvg,
  star: StarSvg,
  play: PlaySvg,
  shield: ShieldSvg,
  bell: BellSvg,
  settings: SettingsSvg,
  logout: LogoutSvg,
  support: SupportSvg,
  crown: CrownSvg,
  camera: CameraSvg,
  mail: MailSvg,
  phone: PhoneSvg,
  "map-pin": MapPinSvg,
  briefcase: BriefcaseSvg,
  "check-circle": CheckCircleSvg,
  clock: ClockSvg,
  plus: PlusSvg,
  "chevron-right": ChevronRightSvg,
  more: MoreSvg,
  wrench: WrenchSvg,
} satisfies Record<IconName, (props: SvgIconProps) => ReactElement>;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const Icon = ({ name, ...props }: IconProps) => {
  const Component = icons[name];

  return <Component aria-hidden="true" focusable="false" {...props} />;
};

export default Icon;
