import { CheckIcon } from '@heroicons/react/24/solid';

import { type Step } from '@/app/event/new/page';

export function ProgressBar({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <nav className="sticky top-8 mx-auto w-[90%]" aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-white/20 rounded-md border border-white/20 bg-[#31263e]/50 md:flex md:divide-y-0"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.id < currentStep ? (
              <a href={step.href} className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#ee5622] group-hover:bg-indigo-800">
                    <CheckIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </span>
                  <span className="ml-4 text-sm font-medium text-white/65">
                    {step.name}
                  </span>
                </span>
              </a>
            ) : step.id === currentStep ? (
              <a
                href={step.href}
                aria-current="step"
                className="flex items-center px-6 py-4 text-sm font-medium"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ee5622]">
                  <span className="text-foreground">{step.id + 1}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-foreground">
                  {step.name}
                </span>
              </a>
            ) : (
              <a href={step.href} className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-white/60 group-hover:text-white">
                      {step.id + 1}
                    </span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-white/60 group-hover:text-white">
                    {step.name}
                  </span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 22 80"
                    preserveAspectRatio="none"
                    className="h-full w-full text-gray-300"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentcolor"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
