import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { type AlertDialogActionProps } from "@radix-ui/react-alert-dialog";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  continueBtnProps?: {
    props?: AlertDialogActionProps;
    label?: string;
  };
};

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  className,
  onSubmit,
  onCancel,
  continueBtnProps,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const checkOutsideClick = useCallback(
    (e: MouseEvent) => {
      const HTMLTarget = e.target as HTMLElement;

      // hack - use a wrapper only class to check if the user clicked outside the modal
      if (HTMLTarget.classList.contains("bg-black/80")) {
        onClose?.();
      }
    },
    [onClose]
  );

  // close modal on outside click
  useEffect(() => {
    if (isOpen) {
      document.body.addEventListener("click", checkOutsideClick);
    }

    return () => {
      if (!isOpen) return;
      document.body.removeEventListener("click", checkOutsideClick);
    };
  }, [onClose, isOpen, checkOutsideClick]);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <AlertDialogContent
        className={className}
        ref={ref}
      >
        <AlertDialogHeader>
          {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {onCancel ? (
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          ) : null}
          <AlertDialogAction
            onClick={onSubmit}
            {...continueBtnProps?.props}
          >
            {continueBtnProps?.label || "Ok"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
