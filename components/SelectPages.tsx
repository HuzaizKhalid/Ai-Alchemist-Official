import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
  setCurrentPage: (n: number) => void;
  setExpandedItems: (s: Set<string | number>) => void; // adjust type if needed
};

export function ItemsPerPage({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  setExpandedItems,
}: Props) {
  const options = [5, 10, 20, 50];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Show:</span>

      <Select
        value={String(itemsPerPage)}
        onValueChange={(val) => {
          const n = Number(val);
          setItemsPerPage(n);
          setCurrentPage(1);
          setExpandedItems(new Set());
        }}
      >
        <SelectTrigger className="w-[90px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={String(opt)}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span>per page</span>
    </div>
  );
}
