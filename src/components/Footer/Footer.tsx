declare const __APP_VERSION__: string;

export const Footer = () => {
  return (
    <footer className="border-t border-gray-300 p-5">
      <p className="text-xs">Version: {__APP_VERSION__}</p>
    </footer>
  );
};
