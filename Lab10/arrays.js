var employees= ["James", "Phineas", "Hercules", "Batgirl", "Wonder Woman"];
var my_kids = [["James", 6, 59.5], ["Goober", 2, 35.2], ["Stretch", 19, 200]];
//console.log(employees);

var my_kid1 = {
    name: "James",
    age: 6,
    weight: 59.5,
}

for (attrib in my_kid1) {
    console.log(my_kid1[attrib]);
}

var my_kid2 = {
    name: "Goober",
    age: 2,
    weight: 35.2,
}

var my_kid3 = {
    name: "Stretch",
    age: 19,
    weight: 200,
}

better_kids = [my_kid1, my_kid2, my_kid3];

/* console.log(better_kids[20]);

for (i = 0; i < better_kids.length; i++) {
    console.log("My kid " + better_kids[i].name + " is " + better_kids[i].age + " years old");
}
*/

/* for (i = 0; i < my_kids.length; i++) {
    console.log("My kid %s weighs %d", my_kids[i][0], my_kids[i][2])
}
*/

/* for (i=0; i < employees.length; i++) {
    if (i % 2 == 0) {
        console.log("Team 1 Member: " + employees[i]);
    } else {
        console.log("Team 2 Member: " + employees[i]);
    }
}

*/