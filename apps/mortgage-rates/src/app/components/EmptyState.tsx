"use client";

export default function EmptyState(): React.ReactElement {
  return (
    <div className="py-12 text-center">
      <svg
        className="mx-auto h-16 w-16 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
        Select a state to get started
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Choose your location above to see today&apos;s mortgage rates for different loan terms.
      </p>
    </div>
  );
}
