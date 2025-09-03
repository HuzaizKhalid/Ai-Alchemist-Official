import React from "react";
import { Timeline } from "@/components/ui/timeline"; // Assuming the timeline component is in this path

export function HowItWorksTimeline() {
  const steps = [
    {
      title: "Step 1: Create Your Account & Set Limits",
      content: (
        <div>
          <p className="text-lg font-normal text-white">
            To begin, create an account to personalize your experience. You can
            set your preferred limits on how much energy, water, and CO2
            emissions you want to utilize for the day before prompting our AI
            model.
          </p>
        </div>
      ),
    },
    {
      title: "Step 2: Prompt the AI & See the Impact",
      content: (
        <div>
          <p className="text-lg font-normal text-white">
            Once your account is set up, enter your prompt to get a response.
            Alongside the answer, you'll see a transparent breakdown of the
            resources that were used to generate it.
          </p>
        </div>
      ),
    },
    {
      title: "Step 3: Compare, Optimize & Track Goals",
      content: (
        <div>
          <p className="mb-4 text-lg font-normal text-white">
            Compare and contrast the resource usage with other available models.
            Monitor improvements, switch to more efficient models, and track
            your usage goals to help promote a healthier environment.
          </p>
          <div className="flex flex-col gap-2 text-lg  text-white">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              Monitor Improvements
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              Use Efficient Models
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              Promote a Healthier Environment
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative ">
      <h2 className="text-3xl font-bold text-center mb-6 text-neutral-900 dark:text-white">
        How It Works
      </h2>
      <Timeline data={steps} />
    </div>
  );
}

export default HowItWorksTimeline;
