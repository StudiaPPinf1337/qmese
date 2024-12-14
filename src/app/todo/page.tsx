"use client";

import { Input } from "@/components/ui/input";
import { TodoElement } from "./_components/TodoElement";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { AddDialog } from "./_components/AddDialog";

export type TTodoElement = {
  label: string;
  content: string;
  status: "pending" | "done" | "cancelled";
  time: number;
};

const MockData: TTodoElement[] = [
  {
    label: "Zrób zakupy",
    content: "Kup mleko i chleb",
    status: "pending",
    time: 1733124664329,
  },
  {
    label: "ZADANIE DOMOWE Z ANGIELSKIEGO",
    content: "ĆWICZENIA 1, 2, 3, 4, 5 STRONA 53",
    status: "done",
    time: 1730175633225,
  },
  {
    label: "Zaimplementować błędy do zadania z QMESE",
    content:
      "Zapytać chata jakie błędy mogą się pojawić, a najlepiej jakby je wygenerował - byłoby suuuuuuuuper",
    status: "cancelled",
    time: 1734124674821,
  },
];
export default function Todo() {
  const [todos, setTodos] = useState<TTodoElement[]>(MockData);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<{
    label: string;
    content: string;
    status: "pending" | "done" | "cancelled";
  }>();

  const editTodo = (data: {
    label: string;
    content: string;
    status: "pending" | "done" | "cancelled";
  }) => {
    if (currentEditIndex !== null) {
      setTodos((prev) =>
        prev.map((todo, index) =>
          index === currentEditIndex
            ? {
                ...todo,
                label: data.label,
                content: data.content,
                status: data.status,
              }
            : todo
        )
      );
      setEditDialogOpen(false);
      reset();
      setCurrentEditIndex(null);
    }
  };

  const deleteTodo = (index: number) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
    setEditDialogOpen(false);
    setCurrentEditIndex(null);
  };

  const openEditDialog = (index: number) => {
    const todo = todos[index];
    setValue("label", todo.label);
    setValue("content", todo.content);
    setValue("status", todo.status);
    setCurrentEditIndex(index);
    setEditDialogOpen(true);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.label.includes(searchQuery) || todo.content.includes(searchQuery);
    const matchesStatus = statusFilter ? todo.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const errorSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setStatusFilter(null);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Input placeholder="Wyszukaj" onChange={(e) => errorSearchQuery(e)} />
        <select
          className="w-48 border rounded p-2 bg-[#3b3b3b] text-white"
          onChange={(e) => setStatusFilter(e.target.value || null)}
          defaultValue=""
        >
          <option value="">Wszystkie statusy</option>
          <option value="pending">Oczekujące</option>
          <option value="done">Zrobione</option>
          <option value="cancelled">Anulowane</option>
        </select>
        <Button onClick={() => setAddDialogOpen(true)}>Dodaj nowe</Button>
      </div>

      <div className="space-y-3">
        {filteredTodos.map((todo, index) => (
          <TodoElement
            key={index}
            {...todo}
            onEdit={() => openEditDialog(index)}
          />
        ))}
      </div>

      <AddDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        setTodos={setTodos}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj zadanie</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(editTodo)}>
            <div className="space-y-4">
              <Input
                {...register("label", { required: true })}
                placeholder="Nazwa zadania"
              />
              <Input
                {...register("content", { required: true })}
                placeholder="Opis zadania"
              />
              <select
                {...register("status", { required: true })}
                className="w-full border rounded p-2 bg-[#3b3b3b] text-white"
              >
                <option value="pending">Pending</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Zapisz</Button>
              <Button
                variant="destructive"
                onClick={() => deleteTodo(currentEditIndex!)}
              >
                Usuń
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
