import React, {useRef, useLayoutEffect} from "react";
import IonIcon from "@reacticons/ionicons";

export default function ScrollToBottom({inputElement, scrollToBottom}) {
    const buttonElement = useRef(null);
    // console.log(inputElement);

    useLayoutEffect(() => {
        // console.log(inputElement);
        const targetElement = buttonElement.current;
        const sourceElement = inputElement.current;

        if (targetElement && sourceElement) {
            const sourceRect = sourceElement.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();

            // console.log("source rect", sourceRect);

            // Calculate the desired top position for the target element
            const topPosition = sourceRect.top - targetRect.height;

            // Set the top position of the target element
            targetElement.style.top = `${topPosition}px`;
            targetElement.style.left = `${sourceRect.right - 15}px`;
        }
    }, [inputElement, buttonElement]);

    return (
        <div onClick={() => scrollToBottom()} ref={buttonElement} className="fixed text-white text-3xl">
            <IonIcon name="chevron-down-circle-outline" />
        </div>
    );
}
