import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectRegion() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Solo</SelectItem>
      </SelectContent>
    </Select>
  );
}
export default SelectRegion;
