"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { TNoteElement } from "../page";

type AddDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setNotes: Dispatch<SetStateAction<TNoteElement[]>>;
};

export const AddDialog: React.FC<AddDialogProps> = (props) => {
  const { open, setOpen, setNotes } = props;

  const { register, handleSubmit, reset } = useForm<{
    label: string;
    content: string;
  }>();

  const addTodo = (data: {
    label: string;
    content: string;
    status?: "pending" | "cancelled" | "done";
  }) => {
    console.log(data);
    const newTodo: TNoteElement = {
      label: data.label || "",
      content: data.content || "",
      time: Date.now(),
    };
    setNotes((prev) => [...prev, newTodo]);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nową notatkę</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit((data) => {
              addTodo(data);
            })(e);
          }}
        >
          <div className="space-y-4">
            <Input {...register("label")} placeholder="Nazwa zadania" />
            <Input {...register("content")} placeholder="Opis zadania" />
          </div>
          <DialogFooter>
            <Button type="submit">Zapisz</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
