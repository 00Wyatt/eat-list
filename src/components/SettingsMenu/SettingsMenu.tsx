import { Popover } from "radix-ui";
import { LuSettings } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";

export const SettingsMenu = () => {
  const { user, logout } = useAuth();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="cursor-pointer p-1 text-xl text-gray-800"
          aria-label="Settings">
          <LuSettings />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="mr-3 flex flex-col gap-2 rounded-lg border border-sky-200 bg-white p-3 shadow-md">
          <p>{user?.email}</p>
          <button
            className="w-full cursor-pointer rounded bg-red-100 px-2 py-1 text-red-700 hover:bg-red-600 hover:text-white"
            onClick={logout}>
            Logout
          </button>
          <Popover.Arrow className="fill-sky-200" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
