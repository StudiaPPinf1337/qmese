"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { TTodoElement } from "../page";

type AddDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setTodos: Dispatch<SetStateAction<TTodoElement[]>>;
};

export const AddDialog: React.FC<AddDialogProps> = (props) => {
  const { open, setOpen, setTodos } = props;

  const { register, handleSubmit, reset, setValue } = useForm<{
    label: string;
    content: string;
    status: "pending" | "done" | "cancelled";
  }>();

  const addTodo = (data: {
    label: string;
    content: string;
    status?: "pending" | "cancelled" | "done";
  }) => {
    console.log(data);
    const newTodo: TTodoElement = {
      label: data.label || "",
      content: data.content || "",
      status: data.status || "pending",
      time: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj nowe zadanie</DialogTitle>
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
