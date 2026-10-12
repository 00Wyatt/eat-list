import { Button } from "@/components/common/Button";
import { useEffect, useState } from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";

type ShoppingListNoteProps = {
  note: string;
  updateNote: (note: string) => void;
};

export const ShoppingListNote = ({
  note,
  updateNote,
}: ShoppingListNoteProps) => {
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (note.trim() !== "") {
      setShowNote(true);
    }
  }, [note]);

  return (
    <form className="flex w-full flex-col gap-2">
      <label htmlFor="shoppingListNote" className="flex flex-col gap-2 text-xs font-medium tracking-wider text-gray-700 uppercase">
        Note
      </label>
      {showNote ? (
        <>
          <textarea
            id="shoppingListNote"
            aria-label="Shopping list note"
            rows={2}
            className="w-full resize-y rounded border border-gray-300 p-3 text-base font-normal tracking-normal text-gray-900"
            value={note}
            onChange={(event) => void updateNote(event.currentTarget.value)}
          />
          <Button
            color="neutral"
            size="large"
            className="w-full"
            onClick={() => {
              updateNote("");
              setShowNote(false);
            }}>
            <LuTrash2 /> Clear Note
          </Button>
        </>
      ) : (
        <Button
          color="neutral"
          size="large"
          className="w-full"
          onClick={() => setShowNote(true)}>
          <LuPencil /> Add Note
        </Button>
      )}
    </form>
  );
};
