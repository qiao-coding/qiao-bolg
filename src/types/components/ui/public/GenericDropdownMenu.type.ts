export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  action?: () => void;
  variant?: 'default' | 'destructive';
  dialog?: {
    title: string;
    content: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  };
  inputDialog?: {
    title: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    confirmText?: string;
    onConfirm: (value: string) => void;
  };
}

export interface GenericDropdownMenuProps {
  items: MenuItem[];
  triggerButtonVariant?: 'ghost' | 'outline' | 'secondary';
  triggerButtonSize?: 'icon' | 'sm' | 'default';
  triggerIcon?: React.ReactNode;
  customTrigger?: React.ReactNode;
}