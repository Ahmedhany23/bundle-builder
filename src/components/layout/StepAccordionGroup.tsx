import React, { useState } from "react";
import { AccordionStep } from "../shared/AccordionStep";
import { ProductStepSection } from "../ProductStep/ProductStepSection";

import CamerIcon from "../../assets/icons/camera-icon.svg";
import PlanIcon from "../../assets/icons/plan-icon.svg";
import SensorIcon from "../../assets/icons/sensor-icon.svg";
import AccessoryIcon from "../../assets/icons/protection-icon.svg";

import { getSelectedCountForCategory } from "../../utils/selectors";
import productsData from "../../data/products.json";
import type { Product, ProductCategory } from "../../types";
import { useBundle } from "../../context/BundleContext";
import { Button } from "../shared/Button";

const products = productsData as Product[];

const STEPS: {
  stepNumber: number;
  title: string;
  category: ProductCategory;
  icon: React.JSX.Element;
}[] = [
  {
    stepNumber: 1,
    title: "Choose your cameras",
    category: "camera",
    icon: (
      <img src={CamerIcon} alt="Camera icon" loading="lazy" width={30} height={30} />
    ),
  },
  {
    stepNumber: 2,
    title: "Choose your plan",
    category: "plan",
    icon: <img src={PlanIcon} alt="plan icon" loading="lazy" width={30} height={31} />,
  },
  {
    stepNumber: 3,
    title: "Choose your sensors",
    category: "sensor",
    icon: <img src={SensorIcon} alt="Sensor icon" loading="lazy" width={32} height={32} />,
  },
  {
    stepNumber: 4,
    title: "Add extra protection",
    category: "accessory",
    icon: (
      <img src={AccessoryIcon} alt="Accessory icon" loading="lazy" width={30} height={30} />
    ),
  },
];

export function StepAccordionGroup() {
  const [openStep, setOpenStep] = useState(1);
  const { state } = useBundle();

  const handleToggle = (stepNumber: number) => {
    setOpenStep((current) => (current === stepNumber ? 0 : stepNumber));
  };

  const handleNext = (currentStepNumber: number) => {
    const next = STEPS.find((s) => s.stepNumber === currentStepNumber + 1);
    if (next) setOpenStep(next.stepNumber);
  };

  return (
    <section className="accordion">
      {STEPS.map((step) => {
        const stepProducts = products.filter(
          (p) => p.category === step.category,
        );
        const selectedCount = getSelectedCountForCategory(
          state.items,
          stepProducts,
        );
        const isOpen = openStep === step.stepNumber;
        const nextStep = STEPS.find(
          (s) => s.stepNumber === step.stepNumber + 1,
        );

        return (
          <AccordionStep
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            totalSteps={STEPS.length}
            title={step.title}
            icon={step.icon}
            selectedCount={selectedCount}
            isOpen={isOpen}
            onToggle={() => handleToggle(step.stepNumber)}
          >
            <div className="step-grid">
              <ProductStepSection products={stepProducts} />
            </div>
            <div
              className="step-footer"
            >
              {nextStep && (
                <Button
                  buttonType="text"
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => handleNext(step.stepNumber)}
                >
                  Next: {nextStep.title}
                </Button>
              )}
            </div>
          </AccordionStep>
        );
      })}
    </section>
  );
}

