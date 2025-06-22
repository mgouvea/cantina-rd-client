"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { capitalizeFirstLastName } from "@/utils";
import { useCategories } from "@/hooks/queries/categories.query";
import { useUserStore, useVisitorStore } from "@/contexts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProductsByCategoryId } from "@/hooks/queries/products.query";
import { CartButton } from "@/components/cartButton";
import { useCartStore } from "@/contexts/cart-store";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/Modal";
import { TableCartProducts } from "@/components/tableCartProducts";
import { Category, Products } from "@/types";
import { useAddOrder, useAddOrderVisitor } from "@/hooks/mutations";
import { Triangle } from "react-loader-spinner";
import { ToastProvider, toast } from "@/components/Toast";
import { Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { CardProducts2 } from "@/components/cardProducts2";

const StorePage = () => {
  // Estado para mostrar dica de rolagem
  const [showScrollHint, setShowScrollHint] = useState(true);

  const router = useRouter();
  const [tabs, setTabs] = useState("0");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const orderSubmittedRef = React.useRef(false);

  const { data: categories } = useCategories();
  const { data: products } = useProductsByCategoryId(categoryId);
  const { totalItems, items, clearCart } = useCartStore();
  const totalPrice = useCartStore((state) => state.totalPrice);
  const { user, update } = useUserStore();
  const { visitor, isVisitorBuying, setIsVisitorBuying } = useVisitorStore();

  const { mutateAsync: addOrder } = useAddOrder();
  const { mutateAsync: addOrderVisitor } = useAddOrderVisitor();

  useEffect(() => {
    setShowScrollHint(true);
    const timer = setTimeout(() => setShowScrollHint(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Set the initial categoryId when categories data is loaded
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Usar a lista ordenada para obter o categoryId correto
      const sortedCategories = [...categories].sort(
        (a: Category, b: Category) => a.name.localeCompare(b.name)
      );
      setCategoryId(sortedCategories[0]._id);
      // Também atualiza o valor da aba para 0 (primeira aba)
      setTabs("0");
    }
  }, [categories]);

  // Reset the order submitted ref when the component mounts or when items change
  useEffect(() => {
    orderSubmittedRef.current = false;
  }, [items]);

  const handleCartClick = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    // Use the ref to check if order was already submitted
    if (orderSubmittedRef.current || isSubmitting) {
      console.log(
        "Order already submitted or in progress, preventing duplicate submission"
      );
      return;
    }

    // Immediately mark as submitted using the ref
    orderSubmittedRef.current = true;

    const payloadCart = {
      buyerId: user?._id || "",
      groupFamilyId: user?.groupFamily || "",
      products: items,
      totalPrice: totalPrice,
      createdAt: new Date(),
      // Add a unique timestamp to prevent duplicate orders
      timestamp: new Date().getTime(),
    };

    const payloadCartVisitor = {
      buyerId: visitor?._id || "",
      products: items,
      totalPrice: totalPrice,
      createdAt: new Date(),
      // Add a unique timestamp to prevent duplicate orders
      timestamp: new Date().getTime(),
    };

    try {
      setIsSubmitting(true);
      setOpen(false);

      if (isVisitorBuying) {
        await addOrderVisitor(payloadCartVisitor);
      } else {
        await addOrder(payloadCart);
      }

      setShowSuccessAnimation(true);

      setTimeout(() => {
        setIsSubmitting(false);
        setIsVisitorBuying(false);
        clearCart();

        setTimeout(() => {
          setShowSuccessAnimation(false);
          router.push("/");
          update(null);
        }, 3000);
      }, 750);
    } catch (error) {
      console.log("Error submitting order:", error);
      setIsSubmitting(false);
      orderSubmittedRef.current = false;

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
    <div className="flex flex-col h-screen py-12 gap-9 overflow-hidden">
      <div className="flex items-center justify-between gap-3 padding-container pr-1">
        <div className="flex items-center gap-3">
          <Image
            src={user?.urlImage || "/avatar.png"}
            alt="avatar"
            width={86}
            height={86}
            className="inline-block size-26 rounded-full ring-2 ring-gray-400 object-cover object-center"
          />
          <div className="flex flex-col gap-2">
            <h3 className="text-light-800 text-4xl font-semibold">
              Olá,{" "}
              {capitalizeFirstLastName(user?.name || visitor?.name, "first")}
            </h3>
            <p className="text-light-800 text-lg font-normal">
              Escolha seus produtos!
            </p>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-xl border border-light-400">
            <CartButton onCartClick={handleCartClick} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 md:px-3 overflow-hidden flex-1">
        <h3 className="text-light-800 text-md pl-3">Cardápio</h3>

        <div className="flex w-full h-full overflow-hidden">
          <Tabs
            defaultValue={String(tabs)}
            className="w-full h-[90%] flex flex-row overflow-hidden"
            orientation="vertical"
            onValueChange={(value) => {
              setTabs(value);
              // Update categoryId when tab changes
              if (categories && categories.length > 0) {
                // Usar a lista ordenada para obter o categoryId correto
                const sortedCategories = [...categories].sort(
                  (a: Category, b: Category) => a.name.localeCompare(b.name)
                );
                setCategoryId(sortedCategories[Number(value)]._id);
              }
            }}
          >
            <TabsList className="flex flex-col h-auto w-auto py-5 bg-white shadow-lg sticky top-0 self-start">
              {categories
                ?.slice()
                .sort((a: Category, b: Category) =>
                  a.name.localeCompare(b.name)
                )
                .map((category: Category, index: number) => (
                  <TabsTrigger
                    key={category._id}
                    value={String(index)}
                    className={`flex-center flex-col justify-center items-center w-[95%] shadow-sm mb-3 ${
                      index === Number(tabs)
                        ? "border-b-9 border-green-600"
                        : "border-2 border-gray-200"
                    }`}
                  >
                    <Image
                      src={category.urlImage}
                      alt={category.name}
                      width={60}
                      height={60}
                      className="h-32 w-auto object-contain text-white"
                    />
                    <span
                      className={`text-md md:text-base uppercase text-wrap ${
                        index === Number(tabs)
                          ? "text-gray-800 font-bold"
                          : "text-gray-600 font-normal antialiased"
                      }`}
                    >
                      {category.name}
                    </span>
                  </TabsTrigger>
                ))}
            </TabsList>

            <div className="relative w-full h-full overflow-y-auto overflow-x-hidden">
              {/* Overlay de orientação de rolagem */}
              <AnimatePresence>
                {showScrollHint && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="mb-4"
                    >
                      <ChevronUp
                        size={48}
                        className="text-white drop-shadow-lg"
                      />
                    </motion.div>
                    <span className="text-white text-2xl font-bold mb-4 drop-shadow-lg">
                      Veja todos os produtos
                    </span>
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        delay: 0.6,
                      }}
                      className="mt-4"
                    >
                      <ChevronDown
                        size={48}
                        className="text-white drop-shadow-lg"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {categories
                  ?.slice()
                  .sort((a: Category, b: Category) =>
                    a.name.localeCompare(b.name)
                  )
                  .map(
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
                            className="w-full h-full px-5 py-2"
                            forceMount
                          >
                            <div className="gap-5 py-1 flex flex-wrap justify-center">
                              {products
                                ?.slice()
                                .sort((a: Products, b: Products) =>
                                  a.name.localeCompare(b.name)
                                )
                                .map((prod: Products) => (
                                  <CardProducts2
                                    key={prod._id}
                                    _id={prod._id}
                                    name={prod.name}
                                    price={prod.price}
                                    urlImage={prod.urlImage}
                                    description={prod.description}
                                  />
                                ))}
                            </div>
                          </TabsContent>
                        </motion.div>
                      )
                  )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
        <div className="flex flex-col gap-2 w-full h-[1/3]">
          <div>
            <p className="font-medium text-light-800 text-2xl capitalize">
              Valor total
            </p>
            <p className="font-bold text-light-800 text-4xl">
              R$ {totalPrice.toFixed(2)}
            </p>
          </div>

          <Button
            variant="default"
            className="w-full btn-socio hover:brightness-90 h-[80px] text-xl flex items-center relative"
            onClick={handleCartClick}
            disabled={totalItems === 0}
          >
            <span className="mx-auto">Revisar pedido</span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2">
              <ChevronRight size={35} />
            </span>
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
