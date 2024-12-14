"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NoteElement } from "./_components/NoteElement";
import { AddDialog } from "./_components/AddDialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type TNoteElement = {
  label: string;
  content: string;
  time: number;
};

const MockData: TNoteElement[] = [
  {
    label: "kocham pierogi",
    content:
      "link do pierogów, które kocham: https://pl.wikipedia.org/wiki/Pierogi",
    time: 1734124674821,
  },
  {
    label: "Sanah refren",
    content:
      "Ta kolońska i szlugi Z tobą lipiec był długi Dobrze wiesz, że tęskniłam O tobie śniłam W tle Del Rey Lana Pogaduchy do rana Po nas nic nie zostanie Piosnek parę",
    time: 1734124674821,
  },
  {
    label: "Dlaczego warto studiować",
    content: "- ...",
    time: 1734124674821,
  },
];

export default function Notes() {
  const [notes, setNotes] = useState<TNoteElement[]>(MockData);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { register, handleSubmit, reset, setValue } = useForm<{
    label: string;
    content: string;
  }>();

  const editNote = (data: { label: string; content: string }) => {
    if (currentEditIndex !== null) {
      setNotes((prev) =>
        prev.map((note, index) =>
          index === currentEditIndex
            ? {
                ...note,
                label: data.label,
                content: data.content,
              }
            : note
        )
      );
      setEditDialogOpen(false);
      reset();
      setCurrentEditIndex(null);
    }
  };

  const deleteNote = (index: number) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
    setEditDialogOpen(false);
    setCurrentEditIndex(null);
  };

  const openEditDialog = (index: number) => {
    const note = notes[index];
    setValue("label", note.label);
    setValue("content", note.content);
    setCurrentEditIndex(index);
    setEditDialogOpen(true);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.label.includes(searchQuery) || note.content.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Wyszukaj"
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Button onClick={() => setAddDialogOpen(true)}>Dodaj nowe</Button>
      </div>
      <div className="space-y-3">
        {filteredNotes.map((note, index) => (
          <NoteElement
            key={index}
            {...note}
            onEdit={() => openEditDialog(index)}
          />
        ))}
      </div>

      <AddDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
        setNotes={setNotes}
      />

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj zadanie</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(editNote)}>
            <div className="space-y-4">
              <Input
                {...register("label", { required: true })}
                placeholder="Nazwa notatki"
              />
              <Input
                {...register("content", { required: true })}
                placeholder="Opis notatki"
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Zapisz</Button>
              <Button
                variant="destructive"
                onClick={() => deleteNote(currentEditIndex!)}
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
