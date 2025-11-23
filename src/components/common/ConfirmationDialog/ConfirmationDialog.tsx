import { Dialog } from "radix-ui";
import { LuX } from "react-icons/lu";

type ConfirmationDialogProps = {
  triggerText?: string;
  title?: string;
  description?: string | React.ReactNode;
  onConfirm?: () => void;
  triggerStyles?: string;
};

export const ConfirmationDialog = ({
  triggerText,
  title,
  description,
  onConfirm,
  triggerStyles = "",
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className={`cursor-pointer text-red-700 hover:underline ${triggerStyles}`}>
          {triggerText}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-sm translate-[-50%] bg-white p-8">
          <Dialog.Title className="mb-2 text-lg font-medium">
            {title}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="cursor-pointer hover:text-gray-700 hover:underline">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="cursor-pointer font-medium hover:text-gray-700 hover:underline"
                onClick={onConfirm}>
                Confirm
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close
            asChild
            className="absolute top-3 right-3 cursor-pointer text-lg hover:text-gray-700">
            <button aria-label="Close">
              <LuX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
