import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
} from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import {
  IconBrandGithub,
  IconDoorEnter,
  IconMenu,
  IconMessageChatbot,
} from "@tabler/icons-react";
import Link from "next/link";
import { Space } from "lucide-react";

interface IMenuePopover {
  logBoxState: boolean;
  blockOverInfoBoxState: boolean;
  postProcessingState: boolean;
  setLogBoxState: Dispatch<SetStateAction<boolean>>;
  setBlockOverInfoBoxState: Dispatch<SetStateAction<boolean>>;
  setPostProcessingState: Dispatch<SetStateAction<boolean>>;
}
export default function MenuePopver(props: IMenuePopover) {
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <Button
          className={"button"}
          size={"lg"}
          color="primary"
          startContent={<IconMenu />}
        >
          Customize
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        {(titleProps) => (
          <div className="px-1 py-2 w-full">
            <p className="text-large font-bold text-foreground" {...titleProps}>
              Settings
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
              <Switch
                defaultSelected={props.logBoxState}
                onValueChange={props.setLogBoxState}
              >
                Log Box
              </Switch>
              <Switch
                defaultSelected={props.blockOverInfoBoxState}
                onValueChange={props.setBlockOverInfoBoxState}
              >
                Hover Block Info Box
              </Switch>
              <Switch
                defaultSelected={props.postProcessingState}
                onValueChange={props.setPostProcessingState}
              >
                Post Processing
              </Switch>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
