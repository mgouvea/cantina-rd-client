import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/contexts/cart-store";

export function TableCartProducts({
  totalPrice,
  items,
}: {
  totalPrice: number;
  items: CartItem[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg w-[100px]">Qtd</TableHead>
          <TableHead className="text-lg w-[60%]">Produto</TableHead>
          <TableHead className="text-lg text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium text-lg text-center">
              {item.quantity}
            </TableCell>
            <TableCell className="font-medium text-lg">{item.name}</TableCell>
            <TableCell className="text-right text-lg">
              R$ {item.price * item.quantity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2} className="text-lg">
            Total
          </TableCell>
          <TableCell className="text-right text-lg text-red-700 font-semibold">
            R$ {totalPrice.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
