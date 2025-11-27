import { Dialog } from "radix-ui";
import { LuX } from "react-icons/lu";

type ModalProps = {
  triggerText?: string;
  title?: string;
  description?: string | React.ReactNode;
};

export const Modal = ({ triggerText, title, description }: ModalProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer font-medium hover:text-gray-700 hover:underline">
          {triggerText}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-sm translate-[-50%] rounded bg-white p-6">
          <Dialog.Title className="mb-2 text-lg font-medium">
            {title}
          </Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
          <Dialog.Close
            asChild
            className="absolute top-4 right-4 cursor-pointer text-lg hover:text-gray-700">
            <button aria-label="Close">
              <LuX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
