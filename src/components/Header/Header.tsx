import { SettingsMenu } from "../SettingsMenu";

export const Header = () => {
  return (
    <header className="border-b border-gray-300 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-800 underline decoration-sky-600 underline-offset-4">
          Eat List
        </h1>
        <SettingsMenu />
      </div>
    </header>
  );
};
