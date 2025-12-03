export const parseShoppingListInput = (input: string) => {
  const trimmed = input.trim();
  const match = /^([0-9]+)\s*(.*)$/i.exec(trimmed);

  let quantityRounded: number;
  let name: string;

  if (match) {
    quantityRounded = parseInt(match[1], 10);
    name = match[2].trim() || "";
  } else {
    quantityRounded = 1;
    name = trimmed;
  }

  return {
    checked: false,
    name,
    quantity: 0,
    quantityRounded,
    unit: "",
  };
};
