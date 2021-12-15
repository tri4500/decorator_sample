// FUNCTION DECORATOR

// Prams checking decorator Sample
console.log('=======================PRAMS CHECKING=======================');
function requireIntegerPrams(target: any, name: string, descriptor: any) {
    var fn = descriptor.value;
    descriptor.value = function (...args: any[]) {
        args.forEach(val => {
            if (!Number.isInteger(val)) {
                throw new Error("ERROR prams must be all Integer");
            }
        });
        return fn.apply(this, args);
    }
}

class Sum {
    @requireIntegerPrams
    add2Int(a: number, b: number) {
        return a + b;
    }

    @requireIntegerPrams
    add3Int(a: number, b: number, c: number) {
        return a + b + c;
    }
}

const tempSum = new Sum();

console.log('try 1 + 2');
try {
    console.log('result: ' + tempSum.add2Int(1, 2));
} catch (err) {
    console.log(err.message);
}

console.log('try 1 + 2.5');
try {
    console.log('result: ' + tempSum.add2Int(1, 2.5));
} catch (err) {
    console.log(err.message);
}

console.log('try 1 + 2 + 5');
try {
    console.log('result: ' + tempSum.add2Int(1, 2));
} catch (err) {
    console.log(err.message);
}

console.log('try 1 + 2.5 + 7.5');
try {
    console.log('result: ' + tempSum.add2Int(1, 2.5));
} catch (err) {
    console.log(err.message);
}



// Caching decorators Sample

console.log('=======================CACHING DECORATOR=======================');
function hashKey(...args: any[]) {
    return args.join(',');
}

function cacheResult(target: any, name: string, descriptor: any) {
    var cache = new Map();
    var fn = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const key = hashKey(...args);
        if (cache.has(key)) {
            return cache.get(key);
        } else {
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
        }
    }
}
class NumberSequence {
    @requireIntegerPrams
    @cacheResult
    fibo(n: number) {
        if (n <= 2) {
            return 1;
        }
        return this.fibo(n - 1) + this.fibo(n - 2);
    }
}

const obj1 = new NumberSequence();
const obj2 = new NumberSequence();

console.time('first time Fibo');
console.log(obj1.fibo(200));
console.timeEnd('first time Fibo');
console.time('second time Fibo');
console.log(obj2.fibo(200));
console.timeEnd('second time Fibo');


// PROPERTY DECORATOR:
function minLength(len: number) {
    return (target: any, name: string) => {
        var curVal = target[name];
        Object.defineProperty(target, name, {
            set: (newVal: any) => {
                if (newVal.length < len) {
                    return;
                }
                curVal = newVal;
            },
            get: () => curVal,
        })
    }
}

class TestPropertyDecorator{
    @minLength(8)
    prop1: string;
    @minLength(10)
    prop2: string;
}

var temp = new TestPropertyDecorator();
temp.prop1 = '123456789';
console.log(temp.prop1);
temp.prop1 = '987654';
console.log(temp.prop1);
temp.prop2 = '123456789';
console.log(temp.prop2);
temp.prop2 = '123456789qwerty';
console.log(temp.prop2);


// Accessor Decorator

const accessId = '123456';

function verifyId(id: string) {
    return (target: any, name: string, propertyDescriptor: PropertyDescriptor) => {
        if (id != accessId) {
            propertyDescriptor.value = (...args: any[]) => {
                throw new Error('Not Accepted');
            }
        }
    }
}


class Accepted {
    @verifyId("123456")
    printList(n: number) {
        for (let i = 0; i <= n; i++) {
            console.log(i);
        }
    }
}

class Unaccepted {
    @verifyId("123")
    printList(n: number) {
        for (let i = 0;i<=n; i++) {
            console.log(i);
        }
    }
}

const t1 = new Accepted();
const t2 = new Unaccepted();

try {
    console.log('Accepted print');
    t1.printList(3);
    console.log('Unaccepted print');
    t2.printList(3);
} catch (err) {
    console.log(err.message);
}

// Methosd Decorator:

function mulArgsBy(n: number) {
    return (target: any, name: string, propertyDescriptor: PropertyDescriptor) => {
        return {
            get() {
                const wrapperFunc = (...args: any[]) => {
                    const newArgs = args.map(x => x * n);
                    propertyDescriptor.value.apply(this, newArgs);
                }
                Object.defineProperty(this, name, {
                    value: wrapperFunc,
                    configurable: true,
                    writable: true
                });
                return wrapperFunc;
            }
        }
    }
}

class TestClass {
    static staticMember = true;

    instanceMember: string = "hello"

    @mulArgsBy(2)
    add2Num(a:number, b:number) {
        console.log(a + b);
    }

    @mulArgsBy(1)
    add3Num(a: number, b: number, c: number) {
        console.log(a + b + c);
    }
}

const tempObj = new TestClass();
tempObj.add2Num(1, 2);
tempObj.add3Num(1, 2, 3);


// Prams Decorator:
function printPram() {
    return (target: Object, methodName: string, pramIndex: number) => {
        console.log('Param ' + pramIndex + ' of method ' + methodName);
    }
}

class TestPram{
    testMethod(@printPram() a: number, b: number) {
        console.log('a+b');
    }
}

const obj5 = new TestPram();
obj5.testMethod(5, 6);


