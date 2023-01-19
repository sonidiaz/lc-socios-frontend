import { ReactNode, useRef, useEffect } from 'react';
import { createPortal } from "react-dom";

const modalRoot = document.getElementById("lc_modal") as HTMLElement;
const mainHeader =  document.querySelector('#main-header') as HTMLElement

type ModalProps = {
  children: ReactNode;
};
const Modal = ({ children }: ModalProps) => {
  const elRef = useRef<HTMLElement | null>(null);
  const elRefHeader = useRef<HTMLElement | null | number>(null);
  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.classList.add('lc-content-modal');
  }
  
  useEffect(() => {
    const el = elRef.current!; // non-null assertion because it will never be null
    modalRoot.appendChild(el);
    modalRoot.classList.add('wrapper-modal')
    elRefHeader.current = mainHeader;
    // modalRoot.style.top = elRefHeader.current.offsetHeight.toString().concat('px')    // eslint-disable-next-line no-debugger
    modalRoot.style.height = '100%'

    return () => {
      modalRoot.removeChild(el);
      modalRoot.style.height = '0'
    };
  }, []);

  return createPortal(children, elRef.current);
}
 
export default Modal;