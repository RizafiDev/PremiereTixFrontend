import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

function SearchTab() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-xl">
      <Command className="border border-b-0 shadow-xs">
        <CommandInput
          ref={inputRef}
          placeholder="Search..."
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false))} // Delay untuk menghindari kehilangan fokus saat klik hasil
        />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0  rounded-lg z-10"
            >
              <CommandList className="absolute left-0 right-0 top-15 bg-white border border-gray-200 shadow-md rounded-lg z-10">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Films">
                  <CommandItem>No result found.</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>Profile</CommandItem>
                  <CommandItem>Billing</CommandItem>
                  <CommandItem>Settings</CommandItem>
                </CommandGroup>
              </CommandList>
            </motion.div>
          )}
        </AnimatePresence>
      </Command>
    </div>
  );
}

export default SearchTab;
