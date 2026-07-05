import type { ReactNode } from "react";

type AccordionStepProps = {
  stepNumber: number;
  totalSteps: number;
  title: string;
  icon: ReactNode;
  selectedCount: number;
  isOpen: boolean;
  onToggle: () => void;
  children?: ReactNode;
};

export function AccordionStep({
  stepNumber,
  totalSteps,
  title,
  icon,
  selectedCount,
  isOpen,
  onToggle,
  children,
}: AccordionStepProps) {
  return (
    <section className={`step ${isOpen ? "active" : ""}`}>
      <div className="step-label">
        STEP {stepNumber} OF {totalSteps}
      </div>
      <div className="step-row" onClick={onToggle}>
        <div className="step-left">
          {icon}
          <h2 className="step-name">{title}</h2>
        </div>
        <div className="step-status">
          {selectedCount !== 0 && `${selectedCount} selected`}

          <svg
            className="caret"
            viewBox="0 0 12 12"
            fill="currentColor"
            aria-hidden="true"
            style={{ transform: isOpen ? "none" : "rotate(180deg)" }}
          >
            <path d="M6 2.6 1.4 7.2h9.2L6 2.6Z" />
          </svg>
        </div>
      </div>
      {isOpen && children}
    </section>
  );
}
