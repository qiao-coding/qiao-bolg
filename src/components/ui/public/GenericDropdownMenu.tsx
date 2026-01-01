'use client';

import { MoreVertical } from 'lucide-react';
import { Button } from '../shadcnComponents/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../shadcnComponents/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcnComponents/dialog';
import { Input } from '../shadcnComponents/input';
import { useState, useCallback, useEffect } from 'react';
import { GenericDropdownMenuProps } from '../../../types/components/ui/public/GenericDropdownMenu.type';

export function GenericDropdownMenu({
  items,
  triggerButtonVariant = 'ghost',
  triggerButtonSize = 'icon',
  triggerIcon,
  customTrigger,
}: GenericDropdownMenuProps) {
  const [dialogStates, setDialogStates] = useState<Record<string, boolean>>({});

  const handleDialogToggle = useCallback((index: number, isOpen: boolean) => {
    setDialogStates(prev => ({
      ...prev,
      [index]: isOpen
    }));
  }, []);

  return (
    <DropdownMenu>
      {customTrigger ? (
        <DropdownMenuTrigger asChild>
          {customTrigger}
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger asChild>
          <Button 
            variant={triggerButtonVariant} 
            size={triggerButtonSize} 
            className="text-muted-foreground hover:text-foreground"
          >
            {triggerIcon || <MoreVertical className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent align="end" className="w-40 rounded-lg border border-border bg-popover p-1 shadow-md z-50">
        {items.map((item, index) => {
          const hasDialog = !!(item.dialog || item.inputDialog);
          
          if (hasDialog) {
            return (
              <Dialog 
                key={index} 
                open={dialogStates[index] || false} 
                onOpenChange={(isOpen) => handleDialogToggle(index, isOpen)}
              >
                <DialogTrigger asChild>
                  <div
                    className={`
                      flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm
                      ${item.variant === 'destructive' 
                        ? 'text-destructive hover:bg-destructive hover:text-white' 
                        : 'hover:bg-accent hover:text-accent-foreground'}
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                </DialogTrigger>
                
                {item.dialog && (
                  <DialogContent className="rounded-lg">
                    <DialogHeader>
                      <DialogTitle>{item.dialog.title}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        item.dialog?.onConfirm();
                        handleDialogToggle(index, false);
                      }}
                    >
                      <div className="py-4 text-sm text-muted-foreground">
                        {item.dialog.content}
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="destructive" 
                          type="submit"
                          onClick={() => {
                            item.dialog?.onConfirm();
                            handleDialogToggle(index, false);
                          }}
                        >
                          {item.dialog.confirmText || '确认'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                )}
                
                {item.inputDialog && (
                  <DialogContent className="rounded-lg">
                    <DialogHeader>
                      <DialogTitle>{item.inputDialog.title}</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        item.inputDialog?.onConfirm(item.inputDialog.value);
                        handleDialogToggle(index, false);
                      }}
                    >
                      <div className="py-4">
                        <label
                          htmlFor={`input-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.inputDialog.label}
                        </label>
                        <Input
                          id={`input-${index}`}
                          placeholder={item.inputDialog.placeholder}
                          value={item.inputDialog?.value || ''}
                          onChange={(e) => item.inputDialog?.onChange(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            item.inputDialog?.onConfirm(item.inputDialog.value);
                            handleDialogToggle(index, false);
                          }}
                        >
                          {item.inputDialog.confirmText || '保存'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                )}
              </Dialog>
            );
          }
          
          return (
            <div
              key={index}
              onClick={item.action}
              className={`
                flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm
                ${item.variant === 'destructive' 
                  ? 'text-destructive hover:bg-destructive hover:text-white' 
                  : 'hover:bg-accent hover:text-accent-foreground'}
              `}
            >
              {item.icon}
              {item.label}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}