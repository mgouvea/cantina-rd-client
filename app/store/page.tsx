"use client";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ChevronRight, ShoppingCart, Package } from "lucide-react";
import { Triangle } from "react-loader-spinner";
import { toast } from "@/components/Toast";
import { Bounce } from "react-toastify";

import { capitalizeFirstLastName } from "@/utils";
import { useCategories } from "@/hooks/queries/categories.query";
import { useProductsByCategoryId } from "@/hooks/queries/products.query";
import { useUserStore, useVisitorStore } from "@/contexts";
import { useCartStore } from "@/contexts/cart-store";
import { useAddOrder, useAddOrderVisitor } from "@/hooks/mutations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DialogCloseButton } from "@/components/Modal";
import { TableCartProducts } from "@/components/tableCartProducts";
import { CartButton } from "@/components/cartButton";
import { CardProducts2 } from "@/components/cardProducts2";
import { ToastProvider } from "@/components/Toast";
import { Category, CreateOrderDto, CreateOrderVisitorDto, Products } from "@/types";

const StorePage = () => {
  const router = useRouter();
  const orderSubmittedRef = useRef(false);

  const [activeTab, setActiveTab] = useState("0");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { data: categories } = useCategories();
  const { data: products } = useProductsByCategoryId(categoryId);
  const { totalItems, items, clearCart, totalPrice } = useCartStore();
  const { user, update } = useUserStore();
  const { visitor, isVisitorBuying, setIsVisitorBuying } = useVisitorStore();
  const { mutateAsync: addOrder } = useAddOrder();
  const { mutateAsync: addOrderVisitor } = useAddOrderVisitor();

  const currentUser = user || visitor;
  const userName = currentUser?.name || "Usuário";
  const avatarUrl = user?.urlImage || "/avatar.png";

  const sortedCategories = useMemo(
    () =>
      categories?.slice().sort((a: Category, b: Category) => a.name.localeCompare(b.name)) || [],
    [categories]
  );

  const sortedProducts = useMemo(
    () => products?.slice().sort((a: Products, b: Products) => a.name.localeCompare(b.name)) || [],
    [products]
  );

  useEffect(() => {
    if (sortedCategories.length > 0) {
      setCategoryId(sortedCategories[0]._id);
      setActiveTab("0");
    }
  }, [sortedCategories]);

  useEffect(() => {
    orderSubmittedRef.current = false;
  }, [items]);

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);
      if (sortedCategories.length > 0) {
        setCategoryId(sortedCategories[Number(value)]._id);
      }
    },
    [sortedCategories]
  );

  const handleConfirm = useCallback(async () => {
    if (orderSubmittedRef.current || isSubmitting) return;

    orderSubmittedRef.current = true;

    const basePayload = {
      products: items,
      totalPrice,
    };

    const memberPayload: CreateOrderDto = {
      ...basePayload,
      buyerId: user?._id || "",
      groupFamilyId: user?.groupFamily || "",
    };

    const visitorPayload: CreateOrderVisitorDto = {
      ...basePayload,
      buyerId: visitor?._id || "",
    };

    try {
      setIsSubmitting(true);
      setIsCartOpen(false);

      if (isVisitorBuying) {
        await addOrderVisitor(visitorPayload);
      } else {
        await addOrder(memberPayload);
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
      console.error("Error submitting order:", error);
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
  }, [
    isSubmitting,
    items,
    totalPrice,
    isVisitorBuying,
    visitor,
    user,
    addOrderVisitor,
    addOrder,
    setIsVisitorBuying,
    clearCart,
    router,
    update,
  ]);

  return (
    <div className="flex flex-col h-screen py-8 gap-6 overflow-hidden bg-linear-to-br from-gray-50 via-white to-green-50/20">
      {/* Header */}
      <div className="padding-container">
        <div className="flex items-center justify-between gap-4 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={avatarUrl}
                alt="avatar"
                width={80}
                height={80}
                className="size-20 rounded-full ring-4 ring-[#005f78]/20 object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-gray-900 text-3xl font-bold">
                Olá, {capitalizeFirstLastName(userName, "first")}!
              </h3>
              <p className="text-gray-600 text-base flex items-center gap-2">
                <Package className="w-4 h-4" />
                Escolha seus produtos
              </p>
            </div>
          </div>

          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg"
            >
              <CartButton onCartClick={handleCartClick} />
            </motion.div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col gap-4 padding-container overflow-hidden flex-1">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-linear-to-b from-[#005f78] to-[#003d4d] rounded-full" />
          <h3 className="text-gray-900 text-2xl font-bold">Cardápio</h3>
        </div>

        <div className="flex w-full h-full overflow-hidden gap-4">
          <Tabs
            value={activeTab}
            className="w-full h-full flex flex-row overflow-hidden"
            orientation="vertical"
            onValueChange={handleTabChange}
          >
            {/* Categories Sidebar */}
            <div
              className="h-full overflow-y-auto bg-white shadow-lg hide-scrollbar"
              style={{
                maxHeight: "calc(100vh - 300px)",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <TabsList className="flex flex-col h-auto w-auto py-5 bg-white">
                {sortedCategories.map((category: Category, index: number) => (
                  <TabsTrigger
                    key={category._id}
                    value={String(index)}
                    className={`flex-center flex-col justify-center items-center w-[95%] shadow-sm mb-3 ${
                      index === Number(activeTab)
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
                        index === Number(activeTab)
                          ? "text-gray-800 font-bold"
                          : "text-gray-600 font-normal antialiased"
                      }`}
                    >
                      {category.name}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Products Grid */}
            <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-white rounded-2xl shadow-lg border border-gray-100 custom-scrollbar">
              <AnimatePresence mode="wait">
                {sortedCategories.map((category: Category, index: number) =>
                  Number(activeTab) === index ? (
                    <motion.div
                      key={category._id}
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-full h-full"
                    >
                      <TabsContent value={String(index)} className="w-full h-full p-6" forceMount>
                        {sortedProducts.length > 0 ? (
                          <div className="grid grid-cols-1 gap-4">
                            {sortedProducts.map((prod: Products) => (
                              <motion.div
                                key={prod._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CardProducts2
                                  _id={prod._id}
                                  name={prod.name}
                                  price={prod.price}
                                  urlImage={prod.urlImage}
                                  description={prod.description}
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Package className="w-16 h-16 mb-4" />
                            <p className="text-lg">Nenhum produto disponível</p>
                          </div>
                        )}
                      </TabsContent>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Footer - Total & Checkout */}
      <div className="padding-container pb-4">
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Valor Total</p>
              <p className="text-4xl font-bold bg-linear-to-r from-[#005f78] to-[#003d4d] bg-clip-text text-transparent">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </p>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-semibold">
                  {totalItems} {totalItems === 1 ? "item" : "itens"}
                </span>
              </div>
            )}
          </div>

          <Button
            className="w-full h-16 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background:
                totalItems > 0 ? "linear-gradient(135deg, #005f78 0%, #003d4d 100%)" : "#e5e7eb",
            }}
            onClick={handleCartClick}
            disabled={totalItems === 0}
          >
            <span>{totalItems === 0 ? "Adicione produtos ao carrinho" : "Revisar Pedido"}</span>
            {totalItems > 0 && <ChevronRight className="w-6 h-6" />}
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
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        onConfirm={handleConfirm}
      >
        <TableCartProducts totalPrice={totalPrice} items={items} />
      </DialogCloseButton>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-white text-4xl font-bold mb-8 text-center px-4"
            >
              Pedido realizado com sucesso!
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="bg-linear-to-br from-green-400 to-green-600 rounded-full p-10 shadow-2xl"
            >
              <ThumbsUp size={120} className="text-white" />
            </motion.div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white text-xl mt-8 text-center px-4"
            >
              Redirecionando em alguns segundos...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastProvider />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #005f78, #003d4d);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #003d4d, #002a38);
        }
      `}</style>
    </div>
  );
};

export default StorePage;
