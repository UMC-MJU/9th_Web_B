import { useReducer, useState } from 'react';
import './App.css';

// 1. state에 대한 interface
interface IState {
    counter: number;
    error: string | null;
}

// 2. reducer에 대한 interface
interface IAction {
    type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
    payload?: number;
}

function reducer(state: IState, action: IAction): IState {
    const { type } = action;
    console.log(state);

    switch (type) {
        case 'INCREASE': {
            return {
                ...state,
                counter: state.counter + 1,
            };
        }
        case 'DECREASE': {
            return {
                ...state,
                counter: state.counter - 1,
            };
        }
        case 'RESET_TO_ZERO': {
            return {
                ...state,
                counter: 0,
            };
        }
        default:
            return state;
    }
}

export default function UseReducerPage() {
    // 1. useState
    const [count, setCount] = useState(0);

    // 2. useReducer
    const [state, dispatch] = useReducer(reducer, {
        counter: 0,
        error: null,
    });

    const handleIncrease = () => {
        setCount(count + 1);
    };

    return (
        <div className="flex flex-col gap-10">
            <div>
                <h2 className="text-3xl">useState</h2>
                <h2>useState훅 사용: {count}</h2>
                <button onClick={handleIncrease}>Increase</button>
            </div>
            <div>
                <h2 className="text-3xl">useReducer</h2>
                <h2>useReducer훅 사용: {state.counter}</h2>
                <button
                    onClick={(): void =>
                        dispatch({
                            type: 'INCREASE',
                        })
                    }
                >
                    Increase
                </button>
                <button
                    onClick={(): void =>
                        dispatch({
                            type: 'DECREASE',
                        })
                    }
                >
                    Decrease
                </button>
                <button
                    onClick={(): void =>
                        dispatch({
                            type: 'RESET_TO_ZERO',
                        })
                    }
                >
                    reset
                </button>
            </div>
        </div>
    );
}
