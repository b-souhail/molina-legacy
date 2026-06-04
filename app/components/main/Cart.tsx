"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
};

const MOCK_ITEMS: CartItem[] = [
  {
    id: "1",
    name: "Veste Heritage",
    variant: "Vert Forêt / L",
    price: 1290,
    quantity: 1,
    image: "/image.png",
  },
  {
    id: "2",
    name: "Pantalon Legacy",
    variant: "Noir / M",
    price: 890,
    quantity: 1,
    image: "/image.png",
  },
];

const formatPrice = (n: number) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(n);

export default function Cart() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(MOCK_ITEMS);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const total = items.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );

  const totalQty = items.reduce(
    (s, i) => s + i.quantity,
    0
  );

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                item.quantity + delta
              ),
            }
          : item
      )
    );
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center justify-center text-(--forest) hover:text-(--gold) transition-colors duration-300 hover:opacity-80">
          <ShoppingBag size={19} strokeWidth={1.7} />
        {totalQty > 0 && (
          <span
            className="
              absolute -right-2 -top-2
              flex h-4 min-w-4 items-center justify-center
              rounded-full
              bg-(--gold)
              px-1
              text-[9px] font-bold text-white
            "
          >
            {totalQty}
          </span>
        )}
      </button>

      {/* OVERLAY */}
      <div onClick={() => setOpen(false)} className={` fixed inset-0 z-40 bg-black/55 transition-opacity duration-300 ${open? "opacity-100": "pointer-events-none opacity-0"}`}/>

      {/* DRAWER */}
      <aside className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l border-(--gold)/15 bg-[#16251d] transition-transform duration-500 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
        {/* TOP GOLD LINE */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-(--gold) to-transparent"/>

        {/* HEADER */}
        <div
          className="
            flex items-center justify-between
            border-b border-white/5
            px-6 py-5
          "
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-(--gold)">
              Molina Legacy
            </p>
            <h2 className="mt-2 font-(family-name:--font-heading) text-3xl text-(--cream)">
              Panier
            </h2>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="
              flex h-9 w-9 items-center justify-center
              border border-(--gold)/15
              text-(--cream)/60
              transition-all duration-300
              hover:border-(--gold)
              hover:text-(--gold)
            "
          >
            <X size={16} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="
                  group
                  flex gap-4
                  border border-white/5
                  bg-white/[0.025]
                  p-3
                  transition-colors duration-300
                  hover:border-(--gold)/20
                "
              >
                {/* IMAGE */}
                <div
                  className="
                    relative
                    h-28 w-20 shrink-0
                    overflow-hidden
                    border border-white/5
                  "
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="
                      object-cover
                      transition-transform duration-500
                      group-hover:scale-[1.03]
                    "
                  />
                </div>

                {/* INFO */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3
                      className="
                        text-sm
                        leading-relaxed
                        text-(--cream)
                      "
                    >
                      {item.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        tracking-[0.08em]
                        text-(--cream)/40
                      "
                    >
                      {item.variant}
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    {/* QTY */}
                    <div
                      className="
                        flex items-center
                        border border-(--gold)/15
                      "
                    >
                      <button
                        onClick={() =>
                          updateQty(item.id, -1)
                        }
                        className="
                          flex h-8 w-8 items-center justify-center
                          text-(--cream)/50
                          transition-colors
                          hover:text-(--gold)
                        "
                      >
                        <Minus size={12} />
                      </button>

                      <span
                        className="
                          w-8 text-center text-sm
                          text-(--cream)
                        "
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(item.id, 1)
                        }
                        className="
                          flex h-8 w-8 items-center justify-center
                          text-(--cream)/50
                          transition-colors
                          hover:text-(--gold)
                        "
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* PRICE */}
                    <div className="text-right">
                      <p className=" text-[11px] uppercase tracking-[0.2em] text-(--cream)/30">
                        Total
                      </p>

                      <p className="mt-1 font-(family-name:--font-heading) text-xl text-(--gold)">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer
          className="
            border-t border-white/5
            bg-[#111c16]
            p-6
          "
        >
          {/* TOTAL */}
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-(--cream)/35">
                Total TTC
              </p>
              <p className="mt-2 font-(family-name:--font-heading) text-4xl text-(--gold)">
                {formatPrice(total)}
              </p>
            </div>
          </div>

          {/* CTA */}
          <button className="h-14 w-full border border-(--gold) bg-(--gold) text-[11px] font-semibold uppercase tracking-[0.35em] text-black transition-all duration-300 hover:opacity-90">
            Commander
          </button>
        </footer>
      </aside>
    </>
  );
}