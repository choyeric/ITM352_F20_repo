// Sum numbers

var target = 5; // Limit the sum of numbers
var counter = 1; // Counter for the loop
var sum = 0; // Total of the numbers added together

while (counter <= target) {
    sum += counter;
    console.log(`Sum = ${sum}`);
    counter++;
}

console.log (`Final Sum = ${sum}`);

sum = 0;
for (counter=5; counter > 0; counter--) {
    sum += counter;
    console.log(`Sum = ${sum}`);
}

console.log(`Final Sum = ${sum}`);