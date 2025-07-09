import React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

type TooltipProps = {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
};

const Tooltip = ({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="bg-black text-white rounded-xl py-1 px-3 shadow-md"
        >
          {content}
          <RadixTooltip.Arrow />
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
export default Tooltip;
