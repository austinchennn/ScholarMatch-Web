import { formatEnumLabel } from "@/lib/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnumSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {(v: string) => (v ? formatEnumLabel(v) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {formatEnumLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
