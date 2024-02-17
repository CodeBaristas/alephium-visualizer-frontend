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
import { IconHelp } from "@tabler/icons-react";

export default function ControlsModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        size={"md"}
        className={"button hide-mobile"}
        startContent={<IconHelp />}
        onPress={onOpen}
      >
        Controls Desktop
      </Button>
      <Modal
        placement={"center"}
        size={"3xl"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Controls explained
              </ModalHeader>
              <ModalBody>
                <p>
                  <b>Zoom</b>: Scroll the mouse wheel up or down. This action
                  zooms you in or out of the scene, making objects appear closer
                  or farther away, similar to using a camera&apos;s zoom
                  function.
                </p>

                <p>
                  <b>Rotate</b>: Click and hold the left mouse button and move
                  the mouse around. This action rotates the view around the
                  scene, allowing you to look around from your current position.
                </p>
                <p>
                  <b>Pan</b>: Click and hold the right mouse button and move the
                  mouse. This moves your view sideways or up and down, shifting
                  the scene without rotating it, as if sliding your viewpoint
                  across a plane.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" size={"lg"} onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
