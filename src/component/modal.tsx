"use client";

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useLayoutEffect
} from "react";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
const TASKBAR_HEIGHT = 48;

type WindowState = {
    x: number;
    y: number;
    width: number;
    height: number;
    isMinimized: boolean;
    isMaximized: boolean;
    isActive: boolean;
    lastX: number;
    lastY: number;
    lastWidth: number;
    lastHeight: number;
};

export type WindowContainerProps = {
    id: string | number;
    title: string;
    onClose: (id: string | number) => void;
    onFocus: (id: string | number) => void;
    children: React.ReactNode;
    initialState?: Partial<WindowState>;
    zIndex: number;
    activeWindowCount?: number;
};

type DragState = {
    isDragging: boolean;
    offsetX: number;
    offsetY: number;
};

type ResizeState = {
    isResizing: boolean;
    direction: string | null;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
};

const LOCAL_STORAGE_KEY_PREFIX = "window_state_";

const WindowContainer: React.FC<WindowContainerProps> = ({
    id,
    title,
    onClose,
    onFocus,
    children,
    initialState = {},
    zIndex,
    activeWindowCount = 0
}) => {
    const mounted = useRef(false);
    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragState>({
        isDragging: false,
        offsetX: 0,
        offsetY: 0
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const storageKey = `${LOCAL_STORAGE_KEY_PREFIX}${id}`;

    // Handle Mobile Detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const getInitialState = useCallback((): WindowState => {
        const defaultWidth = 800;
        const defaultHeight = 600;

        if (typeof window === "undefined") {
            return {
                x: 0,
                y: 0,
                width: defaultWidth,
                height: defaultHeight,
                isMinimized: false,
                isMaximized: false,
                isActive: true,
                lastX: 100,
                lastY: 100,
                lastWidth: 600,
                lastHeight: 400
            };
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - TASKBAR_HEIGHT;
        const stagger = (activeWindowCount % 10) * 20;

        const initialW = Math.min(defaultWidth, screenWidth * 0.8);
        const initialH = Math.min(defaultHeight, screenHeight * 0.8);

        const initialX = (screenWidth - initialW) / 2 + stagger;
        const initialY = screenHeight / 4 + stagger;

        let loadedState: Partial<WindowState> = {};

        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                loadedState = JSON.parse(saved);
            }
        } catch {
            /* ignore */
        }

        const baseState: WindowState = {
            x: initialX,
            y: initialY,
            width: initialW,
            height: initialH,
            isMinimized: false,
            isMaximized: false,
            isActive: true,
            lastX: initialX,
            lastY: initialY,
            lastWidth: initialW,
            lastHeight: initialH
        };

        const finalState = {
            ...baseState,
            ...loadedState,
            ...initialState
        };

        // On mobile or if maximized, force full screen
        if (finalState.isMaximized || window.innerWidth < 768) {
            finalState.x = 0;
            finalState.y = 0;
            finalState.width = screenWidth;
            finalState.height = screenHeight;
        }

        return finalState;
    }, [activeWindowCount, initialState, storageKey]);

    const [state, setState] = useState<WindowState>(getInitialState);

    const [resizeState, setResizeState] = useState<ResizeState>({
        isResizing: false,
        direction: null,
        startX: 0,
        startY: 0,
        startW: 0,
        startH: 0
    });

    useLayoutEffect(() => {
        if (!mounted.current) {
            onFocus(id);
            mounted.current = true;
        }
    }, [id, onFocus]);

    useEffect(() => {
        if (!mounted.current) return;

        const {
            x,
            y,
            width,
            height,
            isMaximized,
            lastX,
            lastY,
            lastWidth,
            lastHeight
        } = state;

        localStorage.setItem(
            storageKey,
            JSON.stringify({
                x,
                y,
                width,
                height,
                isMaximized,
                lastX,
                lastY,
                lastWidth,
                lastHeight
            })
        );
    }, [state, storageKey]);

    const handleFocus = useCallback(() => {
        onFocus(id);
        setState(prev => ({
            ...prev,
            isActive: true,
            isMinimized: false
        }));
    }, [id, onFocus]);

    const handleMaximize = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isMobile) return;

        setState(prev => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight - TASKBAR_HEIGHT;

            if (!prev.isMaximized) {
                return {
                    ...prev,
                    isMaximized: true,
                    lastX: prev.x,
                    lastY: prev.y,
                    lastWidth: prev.width,
                    lastHeight: prev.height,
                    x: 0,
                    y: 0,
                    width: screenWidth,
                    height: screenHeight
                };
            }

            return {
                ...prev,
                isMaximized: false,
                x: prev.lastX,
                y: prev.lastY,
                width: prev.lastWidth,
                height: prev.lastHeight
            };
        });
    }, [isMobile]);

    const handleClose = useCallback(() => {
        onClose(id);
    }, [id, onClose]);

    const handleDragStart = useCallback(
        (e: React.MouseEvent) => {
            if (e.button !== 0 || isMobile) return;
            handleFocus();
            let offsetX = e.clientX - state.x;
            let offsetY = e.clientY - state.y;
            if (state.isMaximized) {
                const ratio = e.clientX / state.width;
                const newX = e.clientX - state.lastWidth * ratio;
                setState(prev => ({
                    ...prev,
                    isMaximized: false,
                    x: newX,
                    y: 0,
                    width: prev.lastWidth,
                    height: prev.lastHeight
                }));
                offsetX = e.clientX - newX;
                offsetY = e.clientY;
            }
            dragRef.current = { isDragging: true, offsetX, offsetY };
            setIsDragging(true);
            e.preventDefault();
        },
        [handleFocus, state, isMobile]
    );

    const handleDrag = useCallback((e: MouseEvent) => {
        if (!dragRef.current.isDragging) return;

        setState(prev => ({
            ...prev,
            x: e.clientX - dragRef.current.offsetX,
            y: e.clientY - dragRef.current.offsetY
        }));
    }, []);

    const handleDragEnd = useCallback(() => {
        if (!dragRef.current.isDragging) return;

        dragRef.current.isDragging = false;
        setIsDragging(false);
        setState(prev => ({
            ...prev,
            lastX: prev.x,
            lastY: prev.y
        }));
    }, []);

    const handleResizeStart = useCallback(
        (e: React.MouseEvent, direction: string) => {
            if (e.button !== 0 || state.isMaximized || isMobile) return;
            handleFocus();
            setResizeState({
                isResizing: true,
                direction,
                startX: e.clientX,
                startY: e.clientY,
                startW: state.width,
                startH: state.height
            });
            e.preventDefault();
            e.stopPropagation();
        },
        [handleFocus, state, isMobile]
    );

    const handleResize = useCallback(
        (e: MouseEvent) => {
            if (!resizeState.isResizing || !resizeState.direction) return;

            const { direction, startX, startY, startW, startH } = resizeState;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            setState(prev => {
                let { x, y, width, height } = prev;
                if (direction.includes("top")) {
                    height = Math.max(MIN_HEIGHT, startH - dy);
                    y = startY + startH - height;
                }
                if (direction.includes("bottom")) {
                    height = Math.max(MIN_HEIGHT, startH + dy);
                }
                if (direction.includes("left")) {
                    width = Math.max(MIN_WIDTH, startW - dx);
                    x = startX + startW - width;
                }
                if (direction.includes("right")) {
                    width = Math.max(MIN_WIDTH, startW + dx);
                }
                return { ...prev, x, y, width, height };
            });
        },
        [resizeState]
    );

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            handleDrag(e);
            handleResize(e);
        };
        const onMouseUp = () => {
            handleDragEnd();
            setResizeState(prev => ({ ...prev, isResizing: false }));
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [handleDrag, handleDragEnd, handleResize]);
    if (state.isMinimized) return null;
    const dynamicStyles: React.CSSProperties = {
        left: isMobile ? 0 : state.x,
        top: isMobile ? 0 : state.y,
        width: isMobile ? "100%" : state.width,
        height: isMobile ? `calc(100vh - ${TASKBAR_HEIGHT}px)` : state.height,
        zIndex,
        borderRadius: (state.isMaximized || isMobile) ? 0 : 10,
        cursor: isDragging ? "grabbing" : "default",
        transition: isDragging || resizeState.isResizing
            ? "none"
            : "all 0.2s cubic-bezier(0.2, 0, 0, 1)"
    };

    return (
        <div
            ref={windowRef}
            onMouseDown={handleFocus}
            className="fixed bg-white shadow-2xl flex flex-col border border-gray-300 overflow-hidden"
            style={dynamicStyles}>
            {/* Resize Handles - Hidden on Mobile */}
            {!state.isMaximized && !isMobile &&
                [
                    "top", "bottom", "left", "right",
                    "top-left", "top-right", "bottom-left", "bottom-right"
                ].map(direction => (
                    <div
                        key={direction}
                        onMouseDown={e => handleResizeStart(e, direction)}
                        className="absolute z-50"
                        style={{
                            ...(direction === "top" && { top: 0, left: 5, right: 5, height: 5, cursor: "n-resize" }),
                            ...(direction === "bottom" && { bottom: 0, left: 5, right: 5, height: 5, cursor: "s-resize" }),
                            ...(direction === "left" && { left: 0, top: 5, bottom: 5, width: 5, cursor: "w-resize" }),
                            ...(direction === "right" && { right: 0, top: 5, bottom: 5, width: 5, cursor: "e-resize" }),
                            ...(direction === "top-left" && { top: 0, left: 0, width: 10, height: 10, cursor: "nwse-resize" }),
                            ...(direction === "top-right" && { top: 0, right: 0, width: 10, height: 10, cursor: "nesw-resize" }),
                            ...(direction === "bottom-left" && { bottom: 0, left: 0, width: 10, height: 10, cursor: "nesw-resize" }),
                            ...(direction === "bottom-right" && { bottom: 0, right: 0, width: 10, height: 10, cursor: "nwse-resize" })
                        }}
                    />
                ))
            }

            {/* Title Bar */}
            <div
                className="shrink-0 flex items-center h-12 md:h-10 px-4 select-none bg-gray-50/80 backdrop-blur-md border-b border-gray-200"
                onMouseDown={handleDragStart}
                onDoubleClick={handleMaximize}>
                <div className="flex items-center gap-3 md:gap-2 mr-4">
                    <button onClick={handleClose} className="w-4 h-4 md:w-3 md:h-3 rounded-full bg-[#ff5f57]" />
                    {!isMobile && (
                        <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-[#28c940]" />
                    )}
                </div>
                <span className="text-sm font-semibold text-gray-600 truncate">
                    {title}
                </span>
            </div>

            {/* Content */}
            <div className="grow overflow-auto bg-white relative">
                {children}
            </div>
        </div>
    );
};

export default WindowContainer;