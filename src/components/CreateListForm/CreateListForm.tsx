import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, setDoc, type DocumentData } from "firebase/firestore";
import { db } from "../../../firebase";
import { FormSelect } from "./components/FormSelect";

const schema = z.object({
  Monday: z.string(),
  Tuesday: z.string(),
  Wednesday: z.string(),
  Thursday: z.string(),
  Friday: z.string(),
  Saturday: z.string(),
  Sunday: z.string(),
});

export type CreateListFormData = z.infer<typeof schema>;

type CreateListFormProps = {
  mealList: DocumentData[];
};

export const CreateListForm = ({ mealList }: CreateListFormProps) => {
  const { register, handleSubmit, reset } = useForm<CreateListFormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: CreateListFormData) => {
    try {
      await setDoc(doc(db, "weeklyMeals", "current"), data);
      reset();
      setSuccessMessage("Shopping list created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-3">
      <FormSelect
        id="monday"
        label="Monday"
        placeholder="Select a meal for Monday"
        mealList={mealList}
        register={register("Monday")}
      />
      <FormSelect
        id="tuesday"
        label="Tuesday"
        placeholder="Select a meal for Tuesday"
        mealList={mealList}
        register={register("Tuesday")}
      />
      <FormSelect
        id="wednesday"
        label="Wednesday"
        placeholder="Select a meal for Wednesday"
        mealList={mealList}
        register={register("Wednesday")}
      />
      <FormSelect
        id="thursday"
        label="Thursday"
        placeholder="Select a meal for Thursday"
        mealList={mealList}
        register={register("Thursday")}
      />
      <FormSelect
        id="friday"
        label="Friday"
        placeholder="Select a meal for Friday"
        mealList={mealList}
        register={register("Friday")}
      />
      <FormSelect
        id="saturday"
        label="Saturday"
        placeholder="Select a meal for Saturday"
        mealList={mealList}
        register={register("Saturday")}
      />
      <FormSelect
        id="sunday"
        label="Sunday"
        placeholder="Select a meal for Sunday"
        mealList={mealList}
        register={register("Sunday")}
      />
      <button
        type="submit"
        className="cursor-pointer self-start border border-gray-500 p-2 hover:bg-gray-200">
        Create List
      </button>

      {successMessage && (
        <>
          <p className="text-green-600">{successMessage}</p>
          <p>Redirecting...</p>
        </>
      )}
    </form>
  );
};
