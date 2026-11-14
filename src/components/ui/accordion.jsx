import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "../../lib/utils";

/**
 * Accordion, ported from lumely_web's animate-ui implementation.
 *
 * Base UI owns the accessibility state (button roles, aria-expanded,
 * aria-controls, keyboard interaction); this file adds the height/mask motion.
 * The panel animates `height`, a vertical lift and a gradient mask together,
 * which is what makes the answer feel like it unfolds rather than snaps.
 *
 * The structure is kept deliberately thin: `Accordion` holds the open value,
 * each `AccordionItem` mirrors its own open state from it, and `AccordionPanel`
 * reads that to animate. Keeping the value in context is what lets a panel
 * animate on close instead of disappearing the moment the trigger flips.
 */

const AccordionContext = React.createContext(undefined);
const AccordionItemContext = React.createContext(undefined);

const useAccordion = () => {
  const ctx = React.useContext(AccordionContext);
  if (ctx === undefined) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return ctx;
};

const useAccordionItem = () => {
  const ctx = React.useContext(AccordionItemContext);
  if (ctx === undefined) {
    throw new Error("useAccordionItem must be used within an AccordionItem");
  }
  return ctx;
};

/** Controlled/uncontrolled value, same contract as the original helper. */
function useControlledState({ value, defaultValue, onChange }) {
  const [state, setInternalState] = React.useState(
    value !== undefined ? value : defaultValue
  );

  React.useEffect(() => {
    if (value !== undefined) setInternalState(value);
  }, [value]);

  const setState = React.useCallback(
    (next, ...args) => {
      setInternalState(next);
      onChange?.(next, ...args);
    },
    [onChange]
  );

  return [state, setState];
}

function Accordion(props) {
  const [value, setValue] = useControlledState({
    value: props?.value,
    defaultValue: props?.defaultValue,
    onChange: props?.onValueChange,
  });

  // Controlled on purpose. Letting Base UI keep its own open state while the
  // panels mirror a second copy in context lets the two disagree: the trigger
  // reports open, the panel stays closed. Feeding `value` back in keeps them on
  // one array, so `isOpen` and `data-open` can never diverge.
  return (
    <AccordionContext.Provider value={{ value, setValue }}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        {...props}
        value={value ?? []}
        onValueChange={setValue}
      />
    </AccordionContext.Provider>
  );
}

function AccordionItem(props) {
  const { value } = useAccordion();
  const [isOpen, setIsOpen] = React.useState(
    value?.includes(props?.value) ?? false
  );

  React.useEffect(() => {
    setIsOpen(value?.includes(props?.value) ?? false);
  }, [value, props?.value]);

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen }}>
      <AccordionPrimitive.Item data-slot="accordion-item" {...props} />
    </AccordionItemContext.Provider>
  );
}

function AccordionHeader(props) {
  return <AccordionPrimitive.Header data-slot="accordion-header" {...props} />;
}

function AccordionTrigger(props) {
  return (
    <AccordionPrimitive.Trigger data-slot="accordion-trigger" {...props} />
  );
}

function AccordionPanel({
  transition = { duration: 0.35, ease: "easeInOut" },
  hiddenUntilFound,
  keepRendered = false,
  ...props
}) {
  const { isOpen } = useAccordionItem();

  const maskStyle = {
    maskImage:
      "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
    WebkitMaskImage:
      "linear-gradient(black var(--mask-stop), transparent var(--mask-stop))",
    overflow: "hidden",
  };

  return (
    <AnimatePresence>
      {keepRendered ? (
        <AccordionPrimitive.Panel
          hidden={false}
          hiddenUntilFound={hiddenUntilFound}
          keepMounted
          render={
            <motion.div
              key="accordion-panel"
              data-slot="accordion-panel"
              initial={{ height: 0, opacity: 0, "--mask-stop": "0%", y: 20 }}
              animate={
                isOpen
                  ? { height: "auto", opacity: 1, "--mask-stop": "100%", y: 0 }
                  : { height: 0, opacity: 0, "--mask-stop": "0%", y: 20 }
              }
              transition={transition}
              style={maskStyle}
              {...props}
            />
          }
        />
      ) : (
        isOpen && (
          <AccordionPrimitive.Panel
            hidden={false}
            hiddenUntilFound={hiddenUntilFound}
            keepMounted
            render={
              <motion.div
                key="accordion-panel"
                data-slot="accordion-panel"
                initial={{ height: 0, opacity: 0, "--mask-stop": "0%", y: 20 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  "--mask-stop": "100%",
                  y: 0,
                }}
                exit={{ height: 0, opacity: 0, "--mask-stop": "0%", y: 20 }}
                transition={transition}
                style={maskStyle}
                {...props}
              />
            }
          />
        )
      )}
    </AnimatePresence>
  );
}

/* ── Styled layer ─────────────────────────────────────────────────────────── */

function StyledAccordionItem({ className, ...props }) {
  return (
    <AccordionItem
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function StyledAccordionTrigger({
  className,
  children,
  showArrow = true,
  ...props
}) {
  return (
    <AccordionHeader className="flex">
      <AccordionTrigger
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none transition-all [&[data-panel-open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-[#141414]/40 transition-transform duration-200" />
        )}
      </AccordionTrigger>
    </AccordionHeader>
  );
}

function StyledAccordionPanel({ className, children, ...props }) {
  return (
    <AccordionPanel {...props}>
      <div className={cn("pb-4 pt-0 text-sm", className)}>{children}</div>
    </AccordionPanel>
  );
}

export {
  Accordion,
  StyledAccordionItem as AccordionItem,
  StyledAccordionTrigger as AccordionTrigger,
  StyledAccordionPanel as AccordionPanel,
  useAccordionItem,
};
