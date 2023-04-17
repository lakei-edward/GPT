import * as React from "react";
import classNames from "classnames";
import { AiOutlineClose } from "react-icons/ai";
import type { IModalPropTypes } from "./types";

const Modal: React.FC<IModalPropTypes> = (props) => {
  const {
    children,
    keyboard = true,
    maskClosable = true,
    onClose,
    open,
    title = "Title",
    width = 520,
  } = props;

  const [isEnter, setIsEnter] = React.useState(true);
  const [isLeave, setIsLeave] = React.useState(false);

  const stopHideModal = (e: any) => e.stopPropagation();

  const hideModal = () => onClose?.();

  const onClickMask = () => {
    if (maskClosable) onClose?.();
  };

  React.useEffect(() => {
    let openTimer: NodeJS.Timer;
    let leaveTimer: NodeJS.Timer;
    if (open) {
      openTimer = setTimeout(() => {
        setIsEnter(false);
      }, 200);
    } else {
      setIsLeave(true);
      leaveTimer = setTimeout(() => {
        setIsLeave(false);
      }, 200);
    }

    const handleEscKey = (event: any) => {
      if (event.keyCode === 27) {
        onClose?.();
      }
    };

    if (keyboard) document.addEventListener("keydown", handleEscKey);

    return () => {
      if (!open) {
        openTimer && clearTimeout(openTimer);
        leaveTimer && clearTimeout(leaveTimer);
      }
      if (keyboard) document.removeEventListener("keydown", handleEscKey);
    };
  }, [open]);

  return (
    <div>
      <div
        className={classNames("inset-0 z-[1000] fixed bg-black/40", {
          "animate-fadeIn": isEnter,
          "animate-fadeOut": isLeave,
        })}
      />
      <div onClick={onClickMask} className="inset-0 fixed z-[1000]">
        <div
          onClick={stopHideModal}
          style={{ width }}
          className={classNames(
            "bg-white w-baseModal rounded-md overflow-hidden max-w-baseModal mx-auto relative top-[8rem]",
            {
              "animate-fadeUp": isEnter,
              "animate-fadeOut": isLeave,
            }
          )}
        >
          <div>
            <div className="relative h-14 flex items-center px-5">
              <span className="font-bold text-lg">{title}</span>
              <div
                onClick={hideModal}
                className="absolute text-black/40 hover:text-black transition-colors right-5 cursor-pointer w-6 h-6 flex justify-center items-center"
              >
                <AiOutlineClose size={18} />
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
