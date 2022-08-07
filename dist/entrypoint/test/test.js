export function test(testName, testFunction) {
    try {
        testFunction();
        console.log(`%cPassed: ${testName}`, 'color: green');
    }
    catch (e) {
        console.log(`%cFailed: ${testName} - ${e}`, 'color: red');
    }
}
export function expect(expression) {
    return {
        toBe(expected) {
            if (expression !== expected) {
                throw `${expression} is not identical to ${expected}`;
            }
        },
        toEqual(expected) {
            if (expression == expected) {
                throw `${expression} is not equal to ${expected}`;
            }
        },
        toBeCloseTo(expected, numberOfDecimalPlaces = 5) {
            const tolerance = 10 ** (-numberOfDecimalPlaces);
            if (typeof expression !== 'number') {
                throw `${expression} is not a number`;
            }
            if (Math.abs(expression - expected) > tolerance) {
                throw `${expression} is more than ${tolerance} from ${expected}`;
            }
        },
        toThrow() {
            let throwed = false;
            if (typeof expression !== 'function') {
                throw 'Expected value is not a function';
            }
            try {
                expression();
            }
            catch (error) {
                throwed = true;
            }
            if (!throwed) {
                throw 'function was expected to throw but didn\'t';
            }
        }
    };
}
