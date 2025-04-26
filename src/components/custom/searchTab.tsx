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
    <div className="relative w-full max-w-lg ">
      <Command className="border border-b-0 shadow-lg shadow-gray-200 dark:shadow-none dark:bg-zinc-800 rounded-full ">
        <CommandInput
          className="font-medium text-sm "
          ref={inputRef}
          placeholder="Mau cari film atau makanan?"
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
              <CommandList className="absolute left-0 right-0 top-15 bg-white border dark:bg-black border-gray-200 shadow-md rounded-lg z-10">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Films">
                  <CommandItem>No result found.</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Makanan">
                  <CommandItem>No result found.</CommandItem>
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
