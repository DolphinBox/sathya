let serverState;
let helpers;

function init(action, sathyaServerState, sathyaHelpers) {
    serverState = sathyaServerState;
    helpers = new sathyaHelpers('HelloJava');

    // Using Java libraries in Sathya

    var System =  Java.type("java.lang.System");
    System.out.println("Hello from OpenJDK on GraalVM!");

    var BigInteger = Java.type('java.math.BigInteger');
    System.out.println(BigInteger.valueOf(2).pow(100).toString(16));
}
module.exports = init;