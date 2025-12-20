import { memo } from "react";

interface ICountButton {
    onClick: (count: number) => void;
}

const CountButton = ({onClick}: ICountButton) => {
    console.log("CountButton 렌더링");

    return (
        <button className='border p-2 rounded-lg' onClick={() => onClick(10)}
        >
            Count 증가
        </button>
    );
}

export default memo(CountButton);