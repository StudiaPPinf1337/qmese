import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TTodoElement } from "../page";
import { Button } from "@/components/ui/button";

export const TodoElement: React.FC<TTodoElement & { onEdit: () => void }> = (
  props
) => {
  const { label, content, status, time, onEdit } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
        <p className="text-sm text-gray-500">
          Status:{" "}
          {status === "cancelled"
            ? "Anulowane"
            : status === "pending"
            ? "Oczekujonce"
            : "Zakończone"}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(time).toLocaleString()}
        </p>
        <div className="mt-2">
          <Button onClick={onEdit}>Edytuj</Button>
        </div>
      </CardContent>
    </Card>
  );
};
