"use client";

import {
  AddressBook,
  ArrowBendUpRight,
  ArrowClockwise,
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  ArrowsClockwise,
  ArrowSquareOut,
  Bank,
  Basket,
  Bug,
  Calendar,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUpDown,
  ChartLineUp,
  ChatCenteredDots,
  ChatCircleText,
  ChatsCircle,
  Check,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  ClipboardText,
  ClockCounterClockwise,
  Coins,
  Copy,
  CreditCard,
  CurrencyCircleDollar,
  DotsThreeOutlineVertical,
  Eye,
  EyeSlash,
  Factory,
  FileDoc,
  Files,
  FolderPlus,
  GearSix,
  HouseSimple,
  ImageSquare,
  Info,
  Lightbulb,
  Link,
  List,
  MagnifyingGlass,
  MinusCircle,
  Monitor,
  Paperclip,
  PaperPlaneRight,
  PaperPlaneTilt,
  PencilSimpleLine,
  Percent,
  PlusCircle,
  Question,
  Receipt,
  Trash,
  TrashSimple,
  UploadSimple,
  User,
  UserCircle,
  UserCirclePlus,
  Users,
  UsersThree,
  Warning,
  WarningDiamond,
  X,
  GithubLogo,
} from "@phosphor-icons/react";
import React from "react";

// export type IconNameProps = 'Bank' | 'PaperPlaneRight' | 'List' | 'ArrowLeft' | 'Files' | 'ClockCounterClockwise' | 'ChatsCircle' | 'Users' | 'Paperclip' | 'PaperPlaneTilt' | 'ArrowRight' | 'Lightbulb' | 'ArrowBendUpRight' | 'ChatCenteredDots' | 'ChartLineUp' | 'Percent' | 'CreditCard' | 'UploadSimple' | 'ImageSquare' | 'WarningDiamond' | 'FileDoc' | 'ArrowSquareOut' | 'Monitor' | 'CurrencyCircleDollar' | 'GearSix' | 'ArrowCounterClockwise' | 'Copy' | 'UserCirclePlus' | 'Question' | 'ArrowClockwise' | 'Basket' | 'CheckSquare' | 'CaretUpDown' | 'Check' | 'CaretDown' | 'Trash' | 'TrashSimple' | 'MinusCircle' | 'ThreeDotsVertical' | 'FolderPlus' | 'PencilSimpleLine' | 'User' | 'CaretLeft' | 'CaretRight' | 'PlusCircle' | 'Search' | 'CheckCircle' | 'Calendar' | 'warning' | 'loader' | 'HouseSimple' | 'Factory' | 'Receipt' | 'ClipboardText' | 'UserCircle' | 'UsersThree' | 'Coins' | 'Link' | 'AddressBook' | 'hidePassword' | 'showPassword' | 'info' | 'close' | ''

interface IPropTypes {
  name: string;
  fontSize?: number;
  color: string;
  hoverColor?: string;
  className?: string;
  weight?: "thin" | "light" | "regular" | "fill" | "duotone" | "bold";
}

const iconMap: { [key: string]: React.ReactElement } = {
  HouseSimple: <HouseSimple />,
  Factory: <Factory />,
  Receipt: <Receipt />,
  ClipboardText: <ClipboardText />,
  UserCircle: <UserCircle />,
  AddressBook: <AddressBook />,
  UsersThree: <UsersThree />,
  Coins: <Coins />,
  Link: <Link />,
  Basket: <Basket />,
  CreditCard: <CreditCard />,

  Bank: <Bank />,
  PaperPlaneRight: <PaperPlaneRight />,
  List: <List />,
  Files: <Files />,
  ClockCounterClockwise: <ClockCounterClockwise />,
  ChatsCircle: <ChatsCircle />,
  Users: <Users />,
  Paperclip: <Paperclip />,
  PaperPlaneTilt: <PaperPlaneTilt />,
  ArrowRight: <ArrowRight />,
  ArrowLeft: <ArrowLeft />,
  Lightbulb: <Lightbulb />,
  ArrowBendUpRight: <ArrowBendUpRight />,
  ChatCenteredDots: <ChatCenteredDots />,
  ChartLineUp: <ChartLineUp />,
  Percent: <Percent />,
  UploadSimple: <UploadSimple />,
  ImageSquare: <ImageSquare />,
  FileDoc: <FileDoc />,
  WarningDiamond: <WarningDiamond />,
  ArrowSquareOut: <ArrowSquareOut />,
  Monitor: <Monitor />,
  CurrencyCircleDollar: <CurrencyCircleDollar />,
  GearSix: <GearSix />,
  ArrowCounterClockwise: <ArrowCounterClockwise />,
  Copy: <Copy />,
  UserCirclePlus: <UserCirclePlus />,
  Question: <Question />,
  ArrowClockwise: <ArrowClockwise />,
  CheckSquare: <CheckSquare />,
  CaretUpDown: <CaretUpDown />,
  Check: <Check />,
  CaretDown: <CaretDown />,
  FolderPlus: <FolderPlus />,
  PencilSimpleLine: <PencilSimpleLine />,
  User: <User />,
  CaretLeft: <CaretLeft />,
  CaretRight: <CaretRight />,
  PlusCircle: <PlusCircle />,
  Search: <MagnifyingGlass />,
  Calendar: <Calendar />,
  hidePassword: <EyeSlash />,
  showPassword: <Eye />,
  info: <Info />,
  close: <X />,
  warning: <Warning />,
  loader: <CircleNotch />,
  CheckCircle: <CheckCircle />,
  ThreeDotsVertical: <DotsThreeOutlineVertical />,
  MinusCircle: <MinusCircle />,
  TrashSimple: <TrashSimple />,
  Trash: <Trash />,
  ChatCircleText: <ChatCircleText />,
  Bug: <Bug />,
  ArrowsClockwise: <ArrowsClockwise />,
  GithubLogo: <GithubLogo />,
};

const IconComponent = ({
  name,
  fontSize,
  color,
  hoverColor,
  className,
  weight,
}: IPropTypes): React.ReactElement | null => {
  const defaultIconSize = 18;
  const selectedIcon = iconMap[name];

  if (selectedIcon) {
    return React.cloneElement(selectedIcon, {
      size: fontSize ?? defaultIconSize,
      color: className?.includes("hover") ? hoverColor : color,
      className: className ?? "",
      weight: weight ?? "bold",
    });
  }

  return null;
};

export default IconComponent;
