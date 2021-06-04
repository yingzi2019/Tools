const a = { a: 1, b: 2, c: 3 };

const n = 0;
const b = Date.now();
while (n < 100000) {
    a.a;
    a.b;
    a.c;
}

console.log(Date.now() - b);
