"use client";

import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";

function SelectTheme() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun /> Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon /> Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <Laptop /> System
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

export default SelectTheme;
