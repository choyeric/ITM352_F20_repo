var num = 0;
var age = 23;

while (num < age) {
    num++;
    if ((num >= age / 2) && (num <= age * 3 / 4)) {
        continue;
    }
    console.log("Age = " + num);
}
console.log(`I'm old!`);