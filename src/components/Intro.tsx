"use client";
import { Suspense, cloneElement, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { IconBrandGithub, IconDoorEnter } from "@tabler/icons-react";

function Ready({ setReady }) {
  useEffect(() => () => void setReady(true), []);
  return null;
}

export default function Intro({ children }) {
  const [clicked, setClicked] = useState(false);
  const [ready, setReady] = useState(false);
  return (
    <>
      <Suspense fallback={<Ready setReady={setReady} />}>
        {cloneElement(children, { ready: clicked && ready })}
      </Suspense>
      <div
        className={`fullscreen bg ${ready ? "ready" : "notready"} ${clicked && "clicked"}`}
      >
        {!clicked && (
          <div>
            <p className={"intro-p"}>
              This app was developed for the first{" "}
              <Link
                className={"underline"}
                href={"https://alephium.org/hackathon/"}
              >
                Alephium Hackathon
              </Link>
              .
            </p>
            <p className={"intro-p"}>
              It visualizes{" "}
              <Link
                className={"underline"}
                href={
                  "https://medium.com/@alephium/an-introduction-to-blockflow-alephiums-sharding-algorithm-bbbf318c3402"
                }
              >
                Alephium&apos;s sharding algorithm <em>Blockflow</em> in 3D
              </Link>
              .
            </p>
            <p className={"intro-p"}>
              At the time of writing this app is best viewed on Desktop devices.
            </p>
            <div className={"enterContainer"}>
              <Button
                size={"lg"}
                className={"button"}
                startContent={<IconDoorEnter />}
                onClick={() => setClicked(true)}
              >
                Enter
              </Button>
              <br />
              <Link
                href={
                  "https://github.com/CodeBaristas/alephium-visualizer-frontend"
                }
                target={"_blank"}
              >
                <Button
                  size={"lg"}
                  className={"button"}
                  startContent={<IconBrandGithub />}
                >
                  Code
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
