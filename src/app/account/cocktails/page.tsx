"use client";

import { useContext, useEffect, useState } from "react";

import { type Cocktail, DepContext } from "@/components/context/dep-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CocktailCard } from "@/components/ui/custom/cocktail-card";
import { Modal } from "@/components/ui/custom/modal";

function TrashIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-red-500 hover:text-red-600 active:text-red-700"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          // eslint-disable-next-line max-len
          d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>
  );
}

export default function AccountCocktails() {
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    cocktail?: Cocktail;
  }>({
    open: false,
    cocktail: undefined,
  });

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const { idxdb } = useContext(DepContext);

  // probably will want to make this a hook instead
  useEffect(() => {
    if (!idxdb) return;

    idxdb.cocktails.toCollection().toArray().then(setCocktails);
  }, [idxdb]);

  function handleDeleteRecord(cocktail: Cocktail) {
    idxdb?.cocktails
      .where("id")
      .equals(cocktail.id)
      .delete()
      .then(() => {
        setCocktails((prev) => prev.filter((c) => c.id !== cocktail.id));
      });
  }

  function handleDeleteModalOpen(cocktail: Cocktail) {
    setDeleteModal({ open: true, cocktail });
  }

  function handleDeleteModalClose() {
    setDeleteModal({ open: false });
  }

  return (
    <main className="flex min-h-screen flex-col items-center md:p-24 p-2 mt-12 md:mt-6">
      <h1 className="text-3xl">Previous Cocktails</h1>
      <Modal
        isOpen={deleteModal.open}
        title="Are you sure you want to delete this cocktail?"
        onClose={handleDeleteModalClose}
        onSubmit={() => {
          if (!deleteModal.cocktail) return;
          handleDeleteRecord(deleteModal.cocktail);
          setDeleteModal({ open: false });
        }}
        onCancel={handleDeleteModalClose}
      >
        This action cannot be undone.
      </Modal>
      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        {cocktails.map((cocktail) => (
          /* grid display  */
          <div
            key={cocktail.id}
            className="grid grid-cols-[1fr,auto] md:grid-cols-[1fr,auto] gap-4 items-center"
          >
            <AccordionItem
              key={cocktail.id}
              value={cocktail.id}
            >
              <AccordionTrigger>{cocktail.name}</AccordionTrigger>
              <AccordionContent>
                <CocktailCard cocktail={cocktail} />
              </AccordionContent>
            </AccordionItem>
            <TrashIcon onClick={() => handleDeleteModalOpen(cocktail)} />
          </div>
        ))}
      </Accordion>
    </main>
  );
}
