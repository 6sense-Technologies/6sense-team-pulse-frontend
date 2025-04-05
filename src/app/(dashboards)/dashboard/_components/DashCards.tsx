import React from "react";

type CardData = {
  title: string;
  value: string | number;
  description: string;
};

type DashCardsProps = {
  data: CardData[];
};

const DashCards: React.FC<DashCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 pl-2 pt-4 pr-6">
      {data.map((card, index) => (
        <div
          key={index}
          className="bg-white border stroke-none border-[#E2E8F0] shadow-sm rounded-lg p-4 w-full px-4 py-2"
        >
          <p className="text-xs text-textMuted font-normal">{card.title}</p>
          <p className="text-[20px] font-medium py-2">{card.value}</p>
          <p className="text-sm font-medium">
            {card.description.split(" ").map((word, i) => {
              const isGreen = word.startsWith("+") || word.endsWith("%");
              return (
                <span
                  key={i}
                  className={isGreen ? "text-[#166534]" : "text-black"}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashCards;