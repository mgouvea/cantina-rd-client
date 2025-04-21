"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { capitalizeFirstLastName } from "@/utils";
import { useCategories } from "@/hooks/queries/categories.query";
import { useUserStore } from "@/contexts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductsByCategoryId } from "@/hooks/queries/products.query";
import { CardProducts } from "@/components/cardProducts";
import { CartButton } from "@/components/cartButton";
import { useCartStore } from "@/contexts/cart-store";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/Modal";
import { TableCartProducts } from "@/components/tableCartProducts";
import { Category, Products } from "@/types";
import { useAddOrder } from "@/hooks/mutations";
import { Triangle } from "react-loader-spinner";
import { ToastProvider, toast } from "@/components/Toast";
import { Bounce } from "react-toastify";
import { useRouter } from "next/navigation";

const StorePage = () => {
  const router = useRouter();
  const [tabs, setTabs] = useState("0");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useCategories();
  const { data: products } = useProductsByCategoryId(categoryId);
  const { totalItems, items, clearCart } = useCartStore();
  const totalPrice = useCartStore((state) => state.totalPrice);
  const { user, update } = useUserStore();

  const { mutateAsync: addOrder } = useAddOrder();

  // Set the initial categoryId when categories data is loaded
  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryId(categories[0]._id);
    }
  }, [categories]);

  const handleCartClick = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    const payloadCart = {
      buyerId: user?._id || "",
      groupFamilyId: user?.groupFamily || "",
      products: items,
      totalPrice: totalPrice,
      createdAt: new Date(),
    };

    try {
      setIsSubmitting(true);
      setOpen(false);

      await addOrder(payloadCart);

      // Aguardar um pouco antes de esconder o loading e mostrar o toast
      setTimeout(() => {
        setIsSubmitting(false);
        // Usar o toast diretamente
        toast.success("Pedido realizado com sucesso!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });

        // Limpar o carrinho
        clearCart();

        // Aguardar um tempo para que o toast seja exibido antes de redirecionar
        setTimeout(() => {
          router.push("/");
          update(null);
        }, 2000); // Espera 2 segundos para redirecionar
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      // Mostrar toast de erro
      toast.error("Erro ao realizar o pedido. Tente novamente.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen py-12 gap-10 overflow-hidden">
      <div className="flex items-center justify-between gap-5 padding-container pr-10">
        <div className="flex items-center gap-5">
          <Image
            src={user?.imageBase64 || "/avatar.png"}
            alt="avatar"
            width={76}
            height={76}
            className="inline-block size-20 rounded-full ring-2 ring-gray-400"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-light-800 text-md font-semibold">
              Olá {capitalizeFirstLastName(user?.name)}
            </h3>
            <div>
              <p className="text-light-800 text-md font-normal">
                Comprou ou está pensando em comprar?
              </p>
              <p className="text-light-800 text-md font-normal">
                Adicione ao carrinho.
              </p>
            </div>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-light-400">
            <CartButton onCartClick={handleCartClick} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 md:px-3 overflow-hidden flex-1">
        <h1 className="text-light-800 text-2xl font-semibold">Cardápio</h1>

        <div className="flex w-full h-full overflow-hidden">
          <Tabs
            defaultValue={String(tabs)}
            className="w-full h-[90%] flex flex-row overflow-hidden"
            orientation="vertical"
            onValueChange={(value) => {
              setTabs(value);
              // Update categoryId when tab changes
              if (categories && categories.length > 0) {
                setCategoryId(categories[Number(value)]._id);
              }
            }}
          >
            <TabsList className="flex flex-col h-auto w-auto py-7  overflow-y-auto bg-cyan-800/40 shadow-lg">
              {categories?.map((category: Category, index: number) => (
                <TabsTrigger
                  key={category._id}
                  value={String(index)}
                  className={`flex-center flex-col w-[93%] ${
                    index === Number(tabs) && "border-b-9 border-cyan-900"
                  }`}
                >
                  <Image
                    src={category.imageBase64}
                    alt={category.name}
                    width={50}
                    height={50}
                    className="h-14 w-auto object-contain text-white"
                  />
                  <span
                    className={`text-md md:text-base capitalize ${
                      index === Number(tabs)
                        ? "text-gray-800 font-bold"
                        : "text-white antialiased"
                    }`}
                  >
                    {category.name}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories?.map((category: Category, index: number) => (
              <TabsContent
                key={category._id}
                value={String(index)}
                className="w-full h-full overflow-y-auto p-4"
              >
                <div className="flex-center flex-wrap gap-9 py-5">
                  {products?.map((prod: Products) => (
                    <CardProducts
                      key={prod._id}
                      _id={prod._id}
                      name={prod.name}
                      price={prod.price}
                      imageBase64={prod.imageBase64}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 w-full h-[1/3]">
          <div>
            <p className="font-bold text-light-800 text-xl capitalize">
              Valor total do carrinho
            </p>
            <p className="font-medium text-light-800 text-md">
              R$ {totalPrice.toFixed(2)}
            </p>
          </div>

          <Button
            variant="default"
            className="w-full btn-socio hover:brightness-90"
            onClick={handleCartClick}
          >
            Avançar
          </Button>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <Triangle
            visible={true}
            height="120"
            width="120"
            color="#fff"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}

      <DialogCloseButton
        title="Finalizar pedido"
        description="Deseja confirmar a compra?"
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
      >
        <TableCartProducts totalPrice={totalPrice} items={items} />
      </DialogCloseButton>

      <ToastProvider />
    </div>
  );
};

export default StorePage;
