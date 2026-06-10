import {
  Children,
  forwardRef,
  isValidElement,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import styles from "./Select.module.scss";

export type SelectSize = "sm" | "md" | "lg";

export type SelectOption = {
  label: ReactNode;
  value: string;
  disabled?: boolean;
};

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "multiple" | "size"
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  selectClassName?: string;
  size?: SelectSize;
  options?: SelectOption[];
  placeholder?: string;
  children?: ReactNode;
}

const getFirstEnabledIndex = (options: SelectOption[]) =>
  options.findIndex((option) => !option.disabled);

const getNextEnabledIndex = (options: SelectOption[], currentIndex: number, direction: 1 | -1) => {
  if (options.length === 0) {
    return -1;
  }

  let nextIndex = currentIndex;

  for (let step = 0; step < options.length; step += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length;

    if (!options[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return currentIndex;
};

const getOptionText = (label: ReactNode) => {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }

  return "";
};

const getOptionsFromChildren = (children: ReactNode): SelectOption[] =>
  Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode; disabled?: boolean; value?: string }>(child)) {
      return [];
    }

    if (child.type !== "option") {
      return [];
    }

    const optionValue =
      child.props.value !== undefined
        ? String(child.props.value)
        : getOptionText(child.props.children);

    return [
      {
        disabled: child.props.disabled,
        label: child.props.children,
        value: optionValue,
      },
    ];
  });

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      autoFocus,
      children,
      className,
      defaultValue,
      disabled = false,
      error,
      fullWidth = true,
      hint,
      id,
      label,
      leftIcon,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      options,
      placeholder,
      required = false,
      selectClassName,
      size = "md",
      tabIndex,
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const labelId = `${selectId}-label`;
    const triggerId = `${selectId}-trigger`;
    const listboxId = `${selectId}-listbox`;
    const descriptionId = `${selectId}-description`;
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [internalValue, setInternalValue] = useState(() => {
      if (value !== undefined) {
        return String(value);
      }

      if (defaultValue !== undefined) {
        return String(defaultValue);
      }

      return "";
    });

    const resolvedOptions = options?.length ? options : getOptionsFromChildren(children);
    const selectedValue = value !== undefined ? String(value) : internalValue;
    const selectedIndex = resolvedOptions.findIndex((option) => option.value === selectedValue);
    const selectedOption = selectedIndex >= 0 ? resolvedOptions[selectedIndex] : undefined;
    const hasDescription = Boolean(error || hint);
    const hasError = Boolean(error);
    const firstEnabledIndex = getFirstEnabledIndex(resolvedOptions);
    const activeOptionId =
      isOpen && highlightedIndex >= 0 ? `${selectId}-option-${highlightedIndex}` : undefined;

    useImperativeHandle(ref, () => hiddenSelectRef.current as HTMLSelectElement);

    useEffect(() => {
      if (!isOpen) {
        return undefined;
      }

      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node;

        if (!rootRef.current?.contains(target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);

      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
      };
    }, [isOpen]);

    useEffect(() => {
      if (!disabled) {
        return;
      }

      setIsOpen(false);
    }, [disabled]);

    useEffect(() => {
      if (!isOpen || highlightedIndex < 0) {
        return;
      }

      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }, [highlightedIndex, isOpen]);

    const dispatchNativeChange = (nextValue: string) => {
      const selectNode = hiddenSelectRef.current;

      if (!selectNode) {
        return;
      }

      const valueSetter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        "value",
      )?.set;

      if (valueSetter) {
        valueSetter.call(selectNode, nextValue);
      } else {
        selectNode.value = nextValue;
      }

      selectNode.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const openMenu = (index = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex) => {
      if (disabled || resolvedOptions.length === 0) {
        return;
      }

      const nextIndex = index >= 0 && !resolvedOptions[index]?.disabled ? index : firstEnabledIndex;

      setHighlightedIndex(nextIndex);
      setIsOpen(true);
    };

    const closeMenu = () => {
      setIsOpen(false);
    };

    const handleOptionSelect = (option: SelectOption, index: number) => {
      if (option.disabled) {
        return;
      }

      if (value === undefined) {
        setInternalValue(option.value);
      }

      setHighlightedIndex(index);
      closeMenu();

      if (selectedValue !== option.value) {
        dispatchNativeChange(option.value);
      }
    };

    const handleTriggerClick = () => {
      if (isOpen) {
        closeMenu();
        return;
      }

      openMenu();
    };

    const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();

          if (!isOpen) {
            openMenu();
          } else {
            setHighlightedIndex((currentIndex) =>
              getNextEnabledIndex(
                resolvedOptions,
                currentIndex >= 0 ? currentIndex : firstEnabledIndex - 1,
                1,
              ),
            );
          }

          break;

        case "ArrowUp":
          event.preventDefault();

          if (!isOpen) {
            openMenu(selectedIndex >= 0 ? selectedIndex : resolvedOptions.length - 1);
          } else {
            setHighlightedIndex((currentIndex) =>
              getNextEnabledIndex(resolvedOptions, currentIndex >= 0 ? currentIndex : 0, -1),
            );
          }

          break;

        case "Enter":
        case " ":
          event.preventDefault();

          if (!isOpen) {
            openMenu();
          } else if (highlightedIndex >= 0) {
            const highlightedOption = resolvedOptions[highlightedIndex];

            if (highlightedOption) {
              handleOptionSelect(highlightedOption, highlightedIndex);
            }
          }

          break;

        case "Escape":
          if (isOpen) {
            event.preventDefault();
            closeMenu();
          }

          break;

        default:
          break;
      }

      onKeyDown?.(event as unknown as ReactKeyboardEvent<HTMLSelectElement>);
    };

    const handleTriggerFocus = (event: ReactFocusEvent<HTMLButtonElement>) => {
      onFocus?.(event as unknown as ReactFocusEvent<HTMLSelectElement>);
    };

    const handleFieldBlurCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
      const nextTarget = event.relatedTarget as Node | null;

      if (nextTarget && rootRef.current?.contains(nextTarget)) {
        return;
      }

      closeMenu();
      onBlur?.(event as unknown as ReactFocusEvent<HTMLSelectElement>);
    };

    return (
      <div
        className={clsx(
          styles.field,
          styles[`field--${size}`],
          {
            [styles["field--full-width"]]: fullWidth,
            [styles["field--disabled"]]: disabled,
            [styles["field--invalid"]]: hasError,
            [styles["field--open"]]: isOpen,
          },
          className,
        )}
        onBlurCapture={handleFieldBlurCapture}
        ref={rootRef}
      >
        {label && (
          <label
            className={styles.label}
            htmlFor={selectId}
            id={labelId}
            onClick={() => triggerRef.current?.focus()}
          >
            {label}
          </label>
        )}

        <div className={styles.control}>
          {leftIcon && (
            <span aria-hidden="true" className={styles.icon}>
              {leftIcon}
            </span>
          )}

          <button
            aria-activedescendant={activeOptionId}
            aria-controls={listboxId}
            aria-describedby={hasDescription ? descriptionId : undefined}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={hasError}
            autoFocus={autoFocus}
            className={clsx(
              styles.trigger,
              {
                [styles["trigger--placeholder"]]: !selectedOption,
              },
              selectClassName,
            )}
            disabled={disabled}
            id={triggerId}
            onClick={handleTriggerClick}
            onFocus={handleTriggerFocus}
            onKeyDown={handleTriggerKeyDown}
            ref={triggerRef}
            role="combobox"
            tabIndex={tabIndex}
            type="button"
          >
            <span className={styles.triggerValue}>
              {selectedOption?.label ?? placeholder ?? "Выберите значение"}
            </span>
          </button>

          <span
            aria-hidden="true"
            className={clsx(styles.indicator, {
              [styles["indicator--open"]]: isOpen,
            })}
          >
            <span className={styles.indicatorChevron} />
          </span>

          <select
            {...props}
            aria-hidden="true"
            className={styles.native}
            disabled={disabled}
            id={selectId}
            onChange={onChange}
            ref={hiddenSelectRef}
            required={required}
            tabIndex={-1}
            value={selectedValue}
          >
            {placeholder && (
              <option disabled={required} hidden={required} value="">
                {placeholder}
              </option>
            )}

            {options?.length
              ? options.map((option) => (
                  <option disabled={option.disabled} key={option.value} value={option.value}>
                    {getOptionText(option.label)}
                  </option>
                ))
              : children}
          </select>

          <div
            className={clsx(styles.dropdown, {
              [styles["dropdown--open"]]: isOpen,
            })}
          >
            <div
              aria-labelledby={label ? labelId : triggerId}
              className={styles.options}
              id={listboxId}
              role="listbox"
            >
              {resolvedOptions.map((option, index) => (
                <button
                  aria-selected={option.value === selectedValue}
                  className={clsx(styles.option, {
                    [styles["option--disabled"]]: option.disabled,
                    [styles["option--highlighted"]]: index === highlightedIndex,
                    [styles["option--selected"]]: option.value === selectedValue,
                  })}
                  disabled={option.disabled}
                  id={`${selectId}-option-${index}`}
                  key={option.value}
                  onClick={() => handleOptionSelect(option, index)}
                  onMouseEnter={() => {
                    if (!option.disabled) {
                      setHighlightedIndex(index);
                    }
                  }}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  role="option"
                  type="button"
                >
                  <span className={styles.optionLabel}>{option.label}</span>
                  <span
                    aria-hidden="true"
                    className={clsx(styles.optionMark, {
                      [styles["optionMark--visible"]]: option.value === selectedValue,
                    })}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasDescription && (
          <p
            className={clsx(styles.description, {
              [styles["description--error"]]: hasError,
            })}
            id={descriptionId}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
