const Monopoly = artifacts.require("Monopoly");

module.exports = function (deployer) {
  deployer.deploy(Monopoly, "0xA1D608aE4EeBeA351108c999e6f373B1514fD2Ea");

};
