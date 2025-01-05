import z from "zod";
import { taskType } from "@/entities/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select.tsx";
import { useTranslation } from "react-i18next";

type Value = z.infer<typeof taskType>;

type Props = {
  value?: Value;
  onChange: (value: Value) => void;
};

export function SelectTaskType({ value, onChange }: Props) {
  const {t} = useTranslation("task")

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {taskType.options.map((type) => (
          <SelectItem value={type}>{t(`items.type.items.${type}.label`)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
