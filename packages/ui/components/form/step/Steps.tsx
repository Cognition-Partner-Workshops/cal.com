import classNames from "@calcom/ui/classNames";

type StepWithNav = {
  maxSteps: number;
  currentStep: number;
  navigateToStep: (step: number) => void;
  disableNavigation?: false;
  stepLabel?: (currentStep: number, maxSteps: number) => string;
};

type StepWithoutNav = {
  maxSteps: number;
  currentStep: number;
  navigateToStep?: undefined;
  disableNavigation: true;
  stepLabel?: (currentStep: number, maxSteps: number) => string;
};

// Discriminative union on disableNavigation prop
type StepsProps = StepWithNav | StepWithoutNav;

const Steps = (props: StepsProps) => {
  const {
    maxSteps,
    currentStep,
    navigateToStep,
    disableNavigation = false,
    stepLabel = (currentStep, totalSteps) => `Step ${currentStep} of ${totalSteps}`,
  } = props;
  return (
    <div className="mt-6 stack-y-2">
      <p className="text-subtle text-xs font-medium">{stepLabel(currentStep, maxSteps)}</p>
      <div data-testid="step-indicator-container" className="flex w-full space-x-2 rtl:space-x-reverse">
        {new Array(maxSteps).fill(0).map((_s, index) => {
          return index <= currentStep - 1 ? (
            <div
              key={`step-${index}`}
              onClick={() => navigateToStep?.(index)}
              className={classNames(
                "h-1 w-full rounded-[1px] bg-blue-600 dark:bg-blue-400",
                index < currentStep - 1 && !disableNavigation ? "cursor-pointer" : ""
              )}
              data-testid={`step-indicator-${index}`}
            />
          ) : (
            <div
              key={`step-${index}`}
              className="h-1 w-full rounded-[1px] bg-blue-200 dark:bg-blue-900"
              data-testid={`step-indicator-${index}`}
            />
          );
        })}
      </div>
    </div>
  );
};
export { Steps };
