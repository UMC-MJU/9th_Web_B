export const isPrime = (num: number): boolean => {
    if (num < 2) return false;

    // 2부터 num-1까지의 수로 나누어 떨어지는 수가 있으면 소수가 아님
    for (let i = 2; i < num ; i++) {
        if (num % i === 0) return false;
    }

    return true;
};

export const findPrimeNumbers = (max: number): number[] => {
    const PrimeNumbers = [];

    for (let i = 2; i <= max; i++) {
        if (isPrime(i)) PrimeNumbers.push(i);
    }

    return PrimeNumbers;
}