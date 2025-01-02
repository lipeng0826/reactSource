import React, { useState, useTransition, useEffect, useRef } from "react";

export default function App() {
    const [state, setState] = useState(""); // 状态更新变量
    const [isPending, startTransition] = useTransition(); // 并发模式，用于低优先级更新
    const buttonRef = useRef(null);
    const buttonRef2 = useRef(null);

    // 模拟渲染大量元素的低优先级任务
    const handleLowPriorityUpdate = (char) => {
        // console.log(new Date().getTime());
        const a = new Date().getTime();
        startTransition(() => {
            console.log(`[Low Priority] Start processing "${char}"...`);
            const elements = [];
            for (let i = 0; i < 10_000_000; i++) {
                elements.push(i); // 模拟渲染耗时操作
            }
            setState((prev) => {
                console.log(new Date().getTime() - a, prev + char);
                return prev + char
            });
            // console.log(`[Low Priority] Added "${char}", state is now: ${state + char}`);
        });
    };

    // 高优先级任务：同步更新
    const handleHighPriorityUpdate = (char) => {
        setState((prev) => {
            console.log(`---high---${char}`, prev + char);
            return prev + char
        });
        // console.log(`[High Priority] Added "${char}", state is now: ${state + char}`);
    };

    useEffect(() => {
        // 模拟任务顺序
        setTimeout(() => {
            const button = buttonRef.current;
            console.log("Triggering Low Priority: A");
            handleLowPriorityUpdate("A"); // 低优先级更新 "A"
            console.log("Triggering High Priority: B");
            // handleHighPriorityUpdate("B"); // 高优先级更新 "B"
            button.click();
        }, 500);

        setTimeout(() => {
            const button2 = buttonRef2.current;
            console.log("Triggering Low Priority: C");
            handleLowPriorityUpdate("C"); // 低优先级更新 "C"
            console.log("Triggering High Priority: D");
            button2.click();
        }, 508);
    }, []);

    return (
        <div>
            <h1>React 并发模式模拟</h1>
            <div>
                <button ref={buttonRef} onClick={() => handleHighPriorityUpdate('B')}>
                    B
                </button>
                <button ref={buttonRef2} onClick={() => handleHighPriorityUpdate('D')}>
                    D
                </button>

            </div>
            <div>
                <p>
                    <strong>State:</strong> {state}
                </p>
                {isPending && <p>低优先级任务处理中...</p>}
            </div>
        </div>
    );
}