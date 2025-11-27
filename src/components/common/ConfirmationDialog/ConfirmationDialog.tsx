import { Dialog } from "radix-ui";
import { LuX } from "react-icons/lu";
import { Button } from "../Button";

type ConfirmationDialogProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string | React.ReactNode;
  onConfirm?: () => void;
};

export const ConfirmationDialog = ({
  trigger,
  title,
  description,
  onConfirm,
}: ConfirmationDialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-sm translate-[-50%] rounded bg-white p-6">
          <Dialog.Title className="mb-2 text-lg font-medium">
            {title}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {description}
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <Button color="neutral" size="large" variant="ghost">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button color="danger" size="large" onClick={onConfirm}>
                Confirm
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Close
            asChild
            className="absolute top-4 right-4 cursor-pointer text-lg">
            <button aria-label="Close">
              <LuX />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
