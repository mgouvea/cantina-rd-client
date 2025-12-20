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
import { ShoppingBag, Package } from "lucide-react";

export function TableCartProducts({
  totalPrice,
  items,
}: {
  totalPrice: number;
  items: CartItem[];
}) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Header minimalista */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-200">
        <ShoppingBag className="text-gray-700" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-white hover:bg-white">
            <TableHead className="text-sm font-semibold text-gray-600 w-[100px] text-center">
              Qtd
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-600 w-[60%]">Produto</TableHead>
            <TableHead className="text-sm font-semibold text-gray-600 text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <Package size={40} />
                  <p className="text-base">Nenhum item no carrinho</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <TableCell className="text-center py-4">
                  <span className="text-lg font-semibold text-gray-900">{item.quantity}</span>
                </TableCell>

                <TableCell className="font-medium text-base text-gray-900 py-4">
                  {item.name}
                </TableCell>

                <TableCell className="text-right py-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </span>
                    <span className="text-base font-semibold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        {items.length > 0 && (
          <TableFooter>
            <TableRow className="border-t-2 border-gray-200 bg-white">
              <TableCell colSpan={2} className="text-base font-semibold text-gray-900 py-5">
                Total
              </TableCell>
              <TableCell className="text-right py-5">
                <span className="text-xl font-bold text-gray-900">R$ {totalPrice.toFixed(2)}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </div>
  );
}
