"use client";

import { Button } from "@/app/components/UI/ButtonComponent";
import IconComponent from "@/app/components/UI/IconComponent";
import ImageComponent from "@/app/components/UI/ImageComponent";
import { COLOR_MENU_TEXT, COLOR_PRIMARY } from "@/app/utils/colorUtils";
import { cn } from "@/app/utils/tailwindMerge";
import Link from "next/link";
import { useState } from "react";

interface IPropTypes {
  currentPage: string
}

type MenuItemsType = {
  name: string
  href: string
  type: 'link' | 'header'
  icon: string
}[]

const MenuComponent = ({ currentPage }: IPropTypes): JSX.Element => {
  console.log(currentPage);
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const menuItems: MenuItemsType = [
    { name: "Home", href: "/", type: "link", icon: "HouseSimple" },
    { name: "Members", href: "/member-list", type: "link", icon: "Users" },

  ]

  return (
    <>
      <div className="mt-6 md:hidden">
        <Button onClick={() => { setMenuIsOpen(true); }} variant={'ghost'} prefixIcon="List" prefixIconColor="#1D1B20" className="px-0 focus:outline-[0px]" />
      </div>
      <div className={cn("max-w-[280px] fixed left-0 top-0 pl-8 z-50 h-screen w-full flex grow flex-col overflow-y-auto bg-[#FAFBFC] transition-transform duration-150 ease-in-out transform md:transform-none", { "-translate-x-full": !menuIsOpen }, { "translate-x-0": menuIsOpen })}>
        <div className="mt-6 flex items-center justify-between">
          <Link href={"/"}>
            <ImageComponent
              src={"/logo/6senseLogo.svg"}
              alt={"Pattern50 Logo"}
              width="w-[132px]"
              height="h-[40px]"
              className="text-left"
            />
          </Link>
          <Button onClick={() => { setMenuIsOpen(false); }} variant={'ghost'} prefixIcon="close" prefixIconColor="#323539" className="md:hidden focus:outline-[0px]" />
        </div>
        <nav className="flex flex-col flex-1 mt-8 text-menuText">
          <ul role="list" className="flex flex-col flex-1">
            <li>
              <ul role="list" className="">
                {
                  menuItems?.map((item, i) => {
                    return (
                      <div key={i} className="mr-8">
                        {
                          item.type === "link" ?
                            <li
                              key={item.name}>
                              <Link
                                href={item.href}
                                className={cn("group items-center text-menuTextColor flex gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-regular hover:bg-secondary",
                                  { "bg-secondary font-semibold text-primary": item.name.toLowerCase() === currentPage })}
                              >
                                {
                                  item?.name ?
                                    <IconComponent
                                      name={item?.icon}
                                      color={item.name.toLowerCase() === currentPage ? COLOR_PRIMARY : COLOR_MENU_TEXT}
                                      weight={item.name.toLowerCase() === currentPage ? 'bold' : 'regular'}
                                      className=""
                                      fontSize={22}
                                    />
                                    : null
                                }
                                {item.name}
                              </Link>
                            </li> :
                            <li className={cn("text-[#858C95] mt-8 text-xs font-bold mb-1")}>{item.name}</li>
                        }
                      </div>
                    )
                  })
                }
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MenuComponent;
