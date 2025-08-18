const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <svg
      className="animate-spin h-10 w-10 text-[#c0404a]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <span className="ml-4 text-[#c0404a] text-lg font-semibold">Loading vehicles...</span>
  </div>
);

export default Loader;