"use client";

import Image from "next/image";

type Profession = {
  id: string;
  label: string;
  abbr: string;
  imageUrl?: string;
};

interface ProfessionStripProps {
  professions?: Profession[];
}

const MOCK_PROFESSIONS: Profession[] = [
  {
    id: "architect",
    label: "Architecte",
    abbr: "AR",
  },
];

export default function ProfessionStrip({
  professions = MOCK_PROFESSIONS,
}: ProfessionStripProps) {
  const hasProfessions = professions.length > 0;

  return (
    <section className="bg-(--gold) px-3 py-2">
      <div className="max-w-7xl mx-auto">
        <div
          className="
            relative
            overflow-hidden
            border
            border-(--forest)/15
            bg-(--cream)/35
            backdrop-blur-sm
            px-3
            py-3
          "
        >
          {/* CORNERS */}
          <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-(--forest)" />
          <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-(--forest)" />
          <span className="absolute left-0 bottom-0 h-4 w-4 border-l border-b border-(--forest)" />
          <span className="absolute right-0 bottom-0 h-4 w-4 border-r border-b border-(--forest)" />

          {/* TOP LINE */}
          <div className="absolute top-0 left-8 right-8 h-px bg-(--forest)/15" />

          {/* BOTTOM LINE */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-(--forest)/15" />

          <div
            className="
              flex
              items-center
              justify-center
              gap-6
              md:gap-10
              overflow-x-auto
              scrollbar-hide
              py-1
            "
          >
            {!hasProfessions ? (
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-14
                    h-14
                    rounded-full
                    border
                    border-(--forest)/20
                    bg-(--cream)
                  "
                >
                  <Image
                    src="/molina-logo.png"
                    alt="Molina Legacy"
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.18em]
                    text-(--forest)
                    whitespace-nowrap
                  "
                >
                  Molina Legacy
                </span>
              </div>
            ) : (
              professions.map((profession) => (
                <button
                  key={profession.id}
                  className="
                    group
                    flex
                    flex-col
                    items-center
                    gap-1.5
                    shrink-0
                  "
                >
                  <div
                    className="
                      p-[2px]
                      rounded-full
                      border
                      border-transparent
                      transition-all
                      duration-500
                      group-hover:border-(--forest)/25
                    "
                  >
                    <div
                      className="
                        relative
                        flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        md:w-14
                        md:h-14
                        rounded-full
                        border
                        border-(--forest)/20
                        bg-(--cream)
                        transition-all
                        duration-500
                        group-hover:scale-105
                      "
                    >
                      {profession.imageUrl ? (
                        <img
                          src={profession.imageUrl}
                          alt={profession.label}
                          className="
                            w-full
                            h-full
                            object-cover
                            rounded-full
                          "
                        />
                      ) : (
                        <span
                          className="
                            text-xs
                            md:text-sm
                            font-semibold
                            tracking-[0.14em]
                            text-(--forest)
                          "
                        >
                          {profession.abbr}
                        </span>
                      )}

                      <span
                        className="
                          absolute
                          inset-1
                          rounded-full
                          border
                          border-(--gold)
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-500
                        "
                      />
                    </div>
                  </div>

                  <span
                    className="
                      text-[8px]
                      md:text-[9px]
                      uppercase
                      tracking-[0.18em]
                      whitespace-nowrap
                      text-(--forest)/70
                      group-hover:text-(--forest)
                      transition-colors
                      duration-300
                    "
                  >
                    {profession.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}