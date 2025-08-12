import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("twitter");
      }}
    >
      <button
        type="submit"
        className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors -webkit-appearance: none appearance-none border-0 outline-none flex items-center gap-3"
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
          className="w-5 h-5 fill-current"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
    </form>
  );
}
