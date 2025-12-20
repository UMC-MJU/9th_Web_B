import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>("");

    const handleIncreaseCount = useCallback((number: number) => {
        setCount(count + number);
        // 빈 배열은 처음 렌더링 될 때만 함수가 생성된다.
        // 함수 내부에서 count 값은 0으로 고정된다.
        // 따라서 버튼을 여러번 눌러도 count 값이 증가하지 않는다.
        // 해결 방법: 의존성 배열에 count 값을 넣어준다.
    }, [count]);
    const handleText = useCallback((text: string) => {
        setText(text);
    }, []);

    return (
        <div>
            <h1>같이 배우는 리엑트 UseCallback편</h1>
            <h2>Count : {count}</h2>
            <CountButton onClick={handleIncreaseCount} />
            <h2>Text</h2>
            <div className="flex flex-col">
                <span>{text}</span>
                <TextInput onChange={handleText} />
            </div>
        </div>
    );
}