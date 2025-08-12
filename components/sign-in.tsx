import { signIn } from "@/auth";

interface SignInProps {
  size?: "small" | "medium" | "large";
}

export default function SignIn({ size = "medium" }: SignInProps) {
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm gap-2",
    medium: "px-4 py-2 text-base gap-2",
    large: "px-6 py-3 text-base gap-3",
  };

  const iconSizes = {
    small: "w-4 h-4",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitter");
      }}
    >
      <button
        type="submit"
        className={`bg-black text-white rounded-md hover:bg-gray-800 transition-colors -webkit-appearance: none appearance-none border-0 outline-none flex items-center ${sizeClasses[size]}`}
        style={{
          WebkitAppearance: "none",
          appearance: "none",
          border: "none",
          outline: "none",
          backgroundClip: "padding-box",
        }}
      >
        Sign in with
        <svg
          viewBox="0 0 24 24"
          className={`${iconSizes[size]} fill-current`}
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
    </form>
  );
}
