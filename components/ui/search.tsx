"use client";

import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@components/ui/input-group";

type SearchProps = {
  onSearch: React.Dispatch<React.SetStateAction<string>>;
};

function SearchComponent({ onSearch }: SearchProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <InputGroup>
      <InputGroupInput placeholder="Search" onChange={handleSearch} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}

export default SearchComponent;
