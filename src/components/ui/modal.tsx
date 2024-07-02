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
  continueBtnProps,
}: Props) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          {title ? <AlertDialogTitle>{title}</AlertDialogTitle> : null}
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmit}
            {...continueBtnProps?.props}
          >
            {continueBtnProps?.label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
