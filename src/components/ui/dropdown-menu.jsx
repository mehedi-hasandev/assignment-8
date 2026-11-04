"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "cn";

function DropdownMenu(props) {
  return <Menu.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props) {
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuPortal(props) {
  return <Menu.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuContent({
  className,
  side = "bottom",
  align = "end",
  sideOffset = 6,
  ...props
}) {
  return (
    <DropdownMenuPortal>
      <Menu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-50"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "min-w-52 origin-(--transform-origin) rounded-lg border border-[#781868]/20 bg-white p-1.5 text-slate-900 shadow-xl shadow-black/30 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </DropdownMenuPortal>
  );
}

function DropdownMenuItem({ className, ...props }) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({ className, ...props }) {
  return (
    <Menu.Group
      data-slot="dropdown-menu-group"
      className={cn(className)}
      {...props}
    />
  );
}

function DropdownMenuLinkItem({ className, ...props }) {
  return (
    <Menu.LinkItem
      data-slot="dropdown-menu-link-item"
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({ className, ...props }) {
  return (
    <Menu.Group>
      <Menu.GroupLabel
        data-slot="dropdown-menu-label"
        className={cn("px-2.5 py-2", className)}
        {...props}
      />
    </Menu.Group>
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1 h-px bg-slate-100", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuLinkItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
