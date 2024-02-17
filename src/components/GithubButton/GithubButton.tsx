import { Button } from "@nextui-org/button";
import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function GithubButton() {
  return (
    <Link
      href={"https://github.com/CodeBaristas/alephium-visualizer-frontend"}
      target={"_blank"}
    >
      <Button
        size={"lg"}
        className={"button"}
        startContent={<IconBrandGithub />}
      >
        <p className={"hide-mobile"}>Code</p>
      </Button>
    </Link>
  );
}
