import { BundleProvider } from "../../context/BundleContext";
import { ReviewPanel } from "../ReviewPanel/ReviewPanel";
import { StepAccordionGroup } from "./StepAccordionGroup";

export default function BundleBuilder() {
  return (
    <BundleProvider>
      <main className="container">
        <div className="bundle-layout">
          <section className="hero">
            <h1>Let's get started!</h1>
          </section>
          <StepAccordionGroup />
          <ReviewPanel />
        </div>
      </main>
    </BundleProvider>
  );
}
