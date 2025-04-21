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
          <TableHead className="w-[100px]">Qtd</TableHead>
          <TableHead className="w-[60%]">Produto</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium text-center">
              {item.quantity}
            </TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-right">
              R$ {item.price * item.quantity}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right text-lg">
            R$ {totalPrice.toFixed(2)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
