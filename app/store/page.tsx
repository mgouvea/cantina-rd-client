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
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp } from "lucide-react";

const StorePage = () => {
  const router = useRouter();
  const [tabs, setTabs] = useState("0");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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

      // Mostrar a animação de sucesso
      setShowSuccessAnimation(true);

      // Aguardar um pouco antes de esconder o loading
      setTimeout(() => {
        setIsSubmitting(false);

        // Limpar o carrinho
        clearCart();

        // Aguardar um tempo para que a animação seja exibida antes de redirecionar
        setTimeout(() => {
          setShowSuccessAnimation(false);
          router.push("/");
          update(null);
        }, 4000); // Espera 4 segundos para redirecionar
      }, 750);
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
            className="inline-block size-27 rounded-full ring-2 ring-gray-400"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-light-800 text-md font-semibold">
              Olá {capitalizeFirstLastName(user?.name)}
            </h3>
            <div>
              <p className="text-light-800 text-lg font-normal">
                Comprou ou está pensando em comprar?
              </p>
              <p className="text-light-800 text-lg font-normal">
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
                    className="h-24 w-auto object-contain text-white"
                  />
                  <span
                    className={`text-md md:text-base capitalize text-wrap ${
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

            <AnimatePresence mode="wait">
              {categories?.map(
                (category: Category, index: number) =>
                  Number(tabs) === index && (
                    <motion.div
                      key={category._id}
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{
                        type: "tween",
                        ease: "circIn",
                        duration: 0.35,
                      }}
                      className="w-full h-full"
                    >
                      <TabsContent
                        value={String(index)}
                        className="w-full h-full overflow-y-auto p-4"
                        forceMount
                      >
                        <div className="flex-center flex-wrap gap-8 py-5 md:grid md:grid-cols-2">
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
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 w-full h-[1/3]">
          <div>
            <p className="font-bold text-light-800 text-2xl capitalize">
              Valor total do carrinho
            </p>
            <p className="font-medium text-light-800 text-xl">
              R$ {totalPrice.toFixed(2)}
            </p>
          </div>

          <Button
            variant="default"
            className="w-full btn-socio hover:brightness-90 h-[80px] text-xl"
            onClick={handleCartClick}
            disabled={totalItems === 0}
          >
            Avançar
          </Button>
        </div>
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Triangle
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            visible={true}
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

      {/* Animação de sucesso */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              duration: 0.8,
            }}
            className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-white text-3xl font-bold mb-6"
            >
              Pedido realizado com sucesso!
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5,
              }}
              className="bg-green-500 rounded-full p-8"
            >
              <ThumbsUp size={100} className="text-white" />
            </motion.div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white text-xl mt-6"
            >
              Redirecionando em alguns segundos...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastProvider />
    </div>
  );
};

export default StorePage;
