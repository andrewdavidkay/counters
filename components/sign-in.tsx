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
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors -webkit-appearance: none appearance-none border-0 outline-none"
        style={{
          WebkitAppearance: "none",
          appearance: "none",
          border: "none",
          outline: "none",
          backgroundClip: "padding-box",
        }}
      >
        Sign in with X
      </button>
    </form>
  );
}
