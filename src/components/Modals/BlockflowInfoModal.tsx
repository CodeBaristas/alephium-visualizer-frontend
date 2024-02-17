import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { IconExternalLink, IconInfoCircle } from "@tabler/icons-react";
import isMobile from "is-mobile";
import clsx from "clsx";

export default function BlockflowInfoModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        size={"md"}
        className={"button"}
        startContent={<IconInfoCircle />}
        onPress={onOpen}
      >
        <p className={"hide-mobile"}>Blockflow</p>
      </Button>
      <Modal
        size={"3xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Blockflow Explained
              </ModalHeader>
              <ModalBody>
                <p>
                  Alephium employs a <b>sharded blockchain architecture</b>,
                  dividing its state into groups for parallel processing across
                  multiple chains to boost throughput. Its distinctive sharding
                  algorithm, <b>Blockflow</b>, leverages a{" "}
                  <b>Directed Acyclic Graph (DAG)</b> to enable significant user
                  experience enhancements, facilitating efficient, secure, and
                  single-step transactions between groups. Blockflow intricately
                  manages the interconnection of blocks across all chains,
                  promoting high transaction rates (potentially up to 10,000
                  TPS) without sacrificing ledger integrity. This approach,
                  alongside similar strategies by platforms like Polkadot,
                  Zilliqa, and Kadena, underscores the scalability benefits of
                  sharding in blockchain by allowing parallel data processing,
                  with Alephium&apos;s Blockflow algorithm particularly noted
                  for its contribution to scaling transaction capacity and
                  enhancing security and user experience.
                </p>

                <p>
                  Currently, Alephium&apos;s mainnet is structured into{" "}
                  <b>16 distinct chains</b>, organized across <b>4 groups</b>. A
                  3D model visually represents this setup, with each
                  chain&apos;s blocks color-coded for clear differentiation.{" "}
                  <b>Intragroup</b> blocks are depicted larger than{" "}
                  <b>intergroup</b> blocks. The connections, or{" "}
                  <b>dependencies</b>, between newly mined blocks and their
                  predecessors are illustrated with lines. This 3D model
                  dynamically updates with block data in real-time, offering a
                  live visualization of Alephium&apos;s blockchain activity.
                </p>
                <p>
                  <br />
                  <b>Dependency example</b>: A new block is mined on chain
                  (3,1). <b>Seven dependencies</b> exist. Four dependencies from
                  each other chain inside the group [(3,0) - (3,1) - (3,2) -
                  (3,3)] and three dependencies from intragroup chains [(0,0) -
                  (1,1) - (2,2)]
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" size={"lg"} onPress={onClose}>
                  Close
                </Button>
                <Link
                  href={
                    "https://medium.com/@alephium/an-introduction-to-blockflow-alephiums-sharding-algorithm-bbbf318c3402"
                  }
                  target={"_blank"}
                >
                  <Button
                    className={"buttonModal"}
                    size={"md"}
                    startContent={<IconExternalLink />}
                    onPress={onClose}
                  >
                    Deeper, Senpai
                  </Button>
                </Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
