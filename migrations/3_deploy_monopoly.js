const Monopoly = artifacts.require("Monopoly");
const MoneyPoly = artifacts.require("MoneyPoly");

module.exports = function() {
    deployer.deploy(Monopoly, "0xab4440899BF3c3a1190871f331bD2Fe42EA7d061", MoneyPoly.address);
}